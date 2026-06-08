package br.com.organizafacil.api.service;

import br.com.organizafacil.api.dto.DashboardDTO;
import br.com.organizafacil.api.model.Despesa;
import br.com.organizafacil.api.model.Objetivo;
import br.com.organizafacil.api.model.Receita;
import br.com.organizafacil.api.repository.DespesaRepository;
import br.com.organizafacil.api.repository.ObjetivoRepository;
import br.com.organizafacil.api.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private ObjetivoRepository objetivoRepository;

    public DashboardDTO gerarDashboard(Long usuarioId) {
        DashboardDTO dto = new DashboardDTO();

        // 1. Busca os dados reais do usuário no banco
        List<Receita> receitas = receitaRepository.findByUsuarioId(usuarioId);
        List<Despesa> despesas = despesaRepository.findByUsuarioId(usuarioId);
        List<Objetivo> objetivos = objetivoRepository.findByUsuarioId(usuarioId);

        // 2. Calcula totais reais
        BigDecimal totalReceitas = receitas.stream()
                .map(Receita::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalFixas = despesas.stream()
                .filter(d -> "FIXA".equals(d.getTipo()))
                .map(Despesa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalVariaveis = despesas.stream()
                .filter(d -> "VARIAVEL".equals(d.getTipo()))
                .map(Despesa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calcula total de dívidas e parcelas separado
        BigDecimal totalDividas = despesas.stream()
                .filter(d -> "DIVIDA".equals(d.getTipo()) ||
                        "PARCELA".equals(d.getTipo()))
                .map(Despesa::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Total geral inclui fixas + variáveis + dívidas/parcelas
        BigDecimal totalDespesas = totalFixas
                .add(totalVariaveis)
                .add(totalDividas);

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        dto.setTotalReceitas(totalReceitas);
        dto.setTotalDespesasFixas(totalFixas);
        dto.setTotalDespesasVariaveis(totalVariaveis);
        dto.setTotalDividas(totalDividas);
        dto.setSaldoDisponivel(saldo);

        // 3. Regra 50-30-20
        if (totalReceitas.compareTo(BigDecimal.ZERO) > 0) {

            dto.setIdealNecessidades(totalReceitas
                    .multiply(new BigDecimal("0.50"))
                    .setScale(2, RoundingMode.HALF_UP));
            dto.setIdealDesejos(totalReceitas
                    .multiply(new BigDecimal("0.30"))
                    .setScale(2, RoundingMode.HALF_UP));
            dto.setIdealInvestimentos(totalReceitas
                    .multiply(new BigDecimal("0.20"))
                    .setScale(2, RoundingMode.HALF_UP));

            dto.setAtualNecessidades(totalFixas);
            dto.setAtualDesejos(totalVariaveis);
            dto.setAtualInvestimentos(
                    saldo.compareTo(BigDecimal.ZERO) > 0
                            ? saldo : BigDecimal.ZERO);
        }

        // 4. Calcula score variável (0 a 1000)
        dto.setScore(calcularScore(
                totalReceitas, totalDespesas, saldo, objetivos, despesas));
        dto.setClassificacaoScore(classificar(dto.getScore()));

        // 5. Gera sugestões personalizadas
        dto.setSugestoes(gerarSugestoes(
                totalReceitas, totalFixas, totalVariaveis,
                totalDividas, saldo, objetivos, despesas));

        return dto;
    }

    private Integer calcularScore(BigDecimal receitas, BigDecimal despesas,
                                  BigDecimal saldo, List<Objetivo> objetivos,
                                  List<Despesa> todasDespesas) {
        int score = 0;

        if (receitas.compareTo(BigDecimal.ZERO) == 0) return 0;

        // Critério 1: proporção despesas/receitas (até 400 pts)
        BigDecimal proporcao = despesas.divide(receitas, 2, RoundingMode.HALF_UP);
        if (proporcao.compareTo(new BigDecimal("0.50")) <= 0) score += 400;
        else if (proporcao.compareTo(new BigDecimal("0.70")) <= 0) score += 300;
        else if (proporcao.compareTo(new BigDecimal("0.90")) <= 0) score += 150;
        else score += 50;

        // Critério 2: saldo disponível (até 300 pts)
        if (saldo.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal propSaldo = saldo.divide(receitas, 2, RoundingMode.HALF_UP);
            if (propSaldo.compareTo(new BigDecimal("0.30")) >= 0) score += 300;
            else if (propSaldo.compareTo(new BigDecimal("0.15")) >= 0) score += 200;
            else score += 100;
        }

        // Critério 3: progresso nos objetivos (até 200 pts)
        if (!objetivos.isEmpty()) {
            double progressoMedio = objetivos.stream()
                    .filter(o -> o.getValorMeta().compareTo(BigDecimal.ZERO) > 0)
                    .mapToDouble(o -> o.getValorAtual()
                            .divide(o.getValorMeta(), 2, RoundingMode.HALF_UP)
                            .doubleValue())
                    .average()
                    .orElse(0);
            score += (int) (progressoMedio * 200);
        }

        // Critério 4: penalidade por dívidas negativadas (-50 pts cada)
        long qtdNegativadas = todasDespesas.stream()
                .filter(d -> Boolean.TRUE.equals(d.getNegativada()))
                .count();
        if (qtdNegativadas > 0) {
            score -= (int) (qtdNegativadas * 50);
            score = Math.max(score, 0);
        }

        return Math.min(score, 1000);
    }

    private String classificar(Integer score) {
        if (score >= 801) return "OTIMO";
        if (score >= 601) return "BOM";
        if (score >= 301) return "REGULAR";
        return "CRITICO";
    }

    private List<String> gerarSugestoes(BigDecimal receitas, BigDecimal fixas,
                                        BigDecimal variaveis, BigDecimal dividas,
                                        BigDecimal saldo, List<Objetivo> objetivos,
                                        List<Despesa> despesas) {
        List<String> sugestoes = new ArrayList<>();

        if (receitas.compareTo(BigDecimal.ZERO) == 0) {
            sugestoes.add("Cadastre suas receitas para receber sugestões personalizadas!");
            return sugestoes;
        }

        // Calcula porcentagens reais
        BigDecimal totalDespesas = fixas.add(variaveis).add(dividas);
        BigDecimal porcFixas = fixas
                .divide(receitas, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(1, RoundingMode.HALF_UP);
        BigDecimal porcTotal = totalDespesas
                .divide(receitas, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(1, RoundingMode.HALF_UP);
        BigDecimal porcSaldo = saldo.compareTo(BigDecimal.ZERO) > 0
                ? saldo.divide(receitas, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Sugestão 1: despesas fixas vs 50% da renda
        if (porcFixas.compareTo(new BigDecimal("50")) > 0) {
            BigDecimal excessoFixas = fixas
                    .subtract(receitas
                            .multiply(new BigDecimal("0.50"))
                            .setScale(2, RoundingMode.HALF_UP));
            sugestoes.add("Suas despesas fixas representam " + porcFixas +
                    "% da sua renda (ideal: até 50%). " +
                    "Tente reduzir R$ " + excessoFixas +
                    " em contratos ou assinaturas.");
        } else {
            sugestoes.add("Suas despesas fixas estão em " + porcFixas +
                    "% da renda — dentro do ideal de 50%! Continue assim.");
        }

        // Sugestão 2: total de despesas acima de 80%
        if (porcTotal.compareTo(new BigDecimal("80")) > 0) {
            sugestoes.add("Atenção! Você compromete " + porcTotal +
                    "% da renda com despesas, sobrando apenas R$ " +
                    saldo + ". Revise seus gastos com urgência.");
        }

        // Sugestão 3: saldo negativo
        if (saldo.compareTo(BigDecimal.ZERO) < 0) {
            sugestoes.add("Você está gastando R$ " + saldo.abs() +
                    " a mais do que ganha! " +
                    "Seus gastos representam " + porcTotal +
                    "% da renda. Corte despesas imediatamente.");
        }

        // Sugestão 4: quanto guardar do saldo positivo
        if (saldo.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal idealPoupanca = receitas
                    .multiply(new BigDecimal("0.20"))
                    .setScale(2, RoundingMode.HALF_UP);
            if (saldo.compareTo(idealPoupanca) >= 0) {
                sugestoes.add("Você tem " + porcSaldo +
                        "% da renda disponível (R$ " + saldo +
                        "). Guarde pelo menos R$ " + idealPoupanca +
                        " (20% da renda) em investimentos!");
            } else {
                sugestoes.add("Você tem R$ " + saldo +
                        " disponível (" + porcSaldo + "% da renda). " +
                        "O ideal seria guardar R$ " + idealPoupanca +
                        " (20%). Tente reduzir R$ " +
                        idealPoupanca.subtract(saldo) +
                        " nas despesas variáveis.");
            }
        }

        // Sugestão 5: dívidas e parcelas comprometendo a renda
        if (dividas.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal porcDividas = dividas
                    .divide(receitas, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(1, RoundingMode.HALF_UP);
            if (porcDividas.compareTo(new BigDecimal("30")) > 0) {
                sugestoes.add("Suas dívidas e parcelas comprometem " +
                        porcDividas + "% da renda (R$ " + dividas +
                        "). Tente renegociar prazos ou antecipar pagamentos.");
            } else {
                sugestoes.add("Suas dívidas e parcelas estão em " +
                        porcDividas + "% da renda (R$ " + dividas +
                        "). Mantenha o controle para não ultrapassar 30%.");
            }
        }

        // Sugestão 6: dívidas negativadas
        boolean temNegativada = despesas.stream()
                .anyMatch(d -> Boolean.TRUE.equals(d.getNegativada()));
        if (temNegativada) {
            long qtdNegativadas = despesas.stream()
                    .filter(d -> Boolean.TRUE.equals(d.getNegativada()))
                    .count();
            BigDecimal totalNegativado = despesas.stream()
                    .filter(d -> Boolean.TRUE.equals(d.getNegativada()))
                    .map(Despesa::getValor)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            sugestoes.add("Você possui " + qtdNegativadas +
                    " dívida(s) negativada(s) totalizando R$ " +
                    totalNegativado + ". Priorize a quitação para " +
                    "limpar seu nome e melhorar seu score.");
        }

        // Sugestão 7: análise por categoria
        analisarCategorias(despesas, receitas, sugestoes);

        // Sugestão 8: progresso dos objetivos
        objetivos.forEach(o -> {
            if (o.getValorMeta().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal progresso = o.getValorAtual()
                        .divide(o.getValorMeta(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                        .setScale(1, RoundingMode.HALF_UP);

                BigDecimal faltante = o.getValorMeta()
                        .subtract(o.getValorAtual());
                BigDecimal porMes = o.getPrazoMeses() > 0
                        ? faltante.divide(
                        new BigDecimal(o.getPrazoMeses()),
                        2, RoundingMode.HALF_UP)
                        : faltante;

                if (progresso.compareTo(new BigDecimal("100")) >= 0) {
                    sugestoes.add("Objetivo '" + o.getNome() +
                            "' concluído! Parabéns! " +
                            "Que tal definir um novo objetivo?");
                } else if (progresso.compareTo(new BigDecimal("75")) >= 0) {
                    sugestoes.add("Objetivo '" + o.getNome() + "': " +
                            progresso + "% concluído. " +
                            "Quase lá! Faltam apenas R$ " + faltante + "!");
                } else if (progresso.compareTo(new BigDecimal("25")) >= 0) {
                    sugestoes.add("Objetivo '" + o.getNome() + "': " +
                            progresso + "% concluído. Faltam R$ " +
                            faltante + ". Guardando R$ " + porMes +
                            "/mês você chega lá!");
                } else {
                    sugestoes.add("Objetivo '" + o.getNome() + "': " +
                            progresso + "% concluído. Guarde R$ " +
                            porMes + "/mês para atingir R$ " +
                            o.getValorMeta() + " em " +
                            o.getPrazoMeses() + " meses.");
                }
            }
        });

        // Sugestão padrão — só se finanças saudáveis
        boolean saldoPositivo = saldo.compareTo(BigDecimal.ZERO) > 0;
        boolean despesasControladas = porcTotal
                .compareTo(new BigDecimal("70")) < 0;
        boolean semNegativadas = !temNegativada;

        if (saldoPositivo && despesasControladas && semNegativadas) {
            sugestoes.add("Suas finanças estão saudáveis! " +
                    "Você compromete " + porcTotal +
                    "% da renda com despesas e tem R$ " +
                    saldo + " (" + porcSaldo +
                    "%) disponível. Continue assim!");
        }

        return sugestoes;
    }

    private void analisarCategorias(List<Despesa> despesas,
                                    BigDecimal receitas,
                                    List<String> sugestoes) {
        if (despesas.isEmpty()) return;

        Map<String, BigDecimal> porCategoria = despesas.stream()
                .filter(d -> d.getCategoria() != null)
                .collect(Collectors.groupingBy(
                        d -> d.getCategoria().toUpperCase(),
                        Collectors.reducing(BigDecimal.ZERO,
                                Despesa::getValor, BigDecimal::add)
                ));

        porCategoria.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(maior -> {
                    BigDecimal porcentagem = maior.getValue()
                            .divide(receitas, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                            .setScale(1, RoundingMode.HALF_UP);

                    if (porcentagem.compareTo(new BigDecimal("20")) > 0) {
                        sugestoes.add("Sua maior despesa é '" +
                                maior.getKey() + "' com R$ " +
                                maior.getValue() + " (" + porcentagem +
                                "% da renda). Vale revisar esse gasto!");
                    }
                });

        porCategoria.forEach((categoria, total) -> {
            BigDecimal porcentagem = total
                    .divide(receitas, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(1, RoundingMode.HALF_UP);

            if (porcentagem.compareTo(new BigDecimal("15")) > 0) {
                sugestoes.add("Categoria '" + categoria +
                        "': R$ " + total + " (" + porcentagem +
                        "% da renda). Verifique se é possível reduzir.");
            }
        });
    }
}