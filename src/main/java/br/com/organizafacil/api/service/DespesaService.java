package br.com.organizafacil.api.service;

import br.com.organizafacil.api.model.Despesa;
import br.com.organizafacil.api.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class DespesaService {

    @Autowired
    private DespesaRepository despesaRepository;

    public List<Despesa> listarTodos() {
        return despesaRepository.findAll();
    }

    public List<Despesa> listarPorUsuario(Long usuarioId) {
        return despesaRepository.findByUsuarioId(usuarioId);
    }

    public List<Despesa> listarPorTipo(Long usuarioId, String tipo) {
        return despesaRepository.findByUsuarioIdAndTipo(usuarioId, tipo);
    }

    public List<Despesa> listarParcelas(Long usuarioId) {
        return despesaRepository.findByUsuarioIdAndTipo(usuarioId, "PARCELA");
    }

    public Optional<Despesa> buscarPorId(Long id) {
        return despesaRepository.findById(id);
    }

    public Despesa salvar(Despesa despesa) {
        return despesaRepository.save(despesa);
    }

    public Despesa atualizar(Long id, Despesa despesaAtualizada) {
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada!"));
        despesa.setDescricao(despesaAtualizada.getDescricao());
        despesa.setValor(despesaAtualizada.getValor());
        despesa.setTipo(despesaAtualizada.getTipo());
        despesa.setCategoria(despesaAtualizada.getCategoria());
        despesa.setData(despesaAtualizada.getData());
        despesa.setDiaVencimento(despesaAtualizada.getDiaVencimento());

        // Campos novos de parcela
        despesa.setTotalParcelas(despesaAtualizada.getTotalParcelas());
        despesa.setParcelaAtual(despesaAtualizada.getParcelaAtual());
        despesa.setValorParcela(despesaAtualizada.getValorParcela());

        // Campos de dívida
        despesa.setNomeCredor(despesaAtualizada.getNomeCredor());
        despesa.setValorOriginal(despesaAtualizada.getValorOriginal());
        despesa.setNegativada(despesaAtualizada.getNegativada());

        return despesaRepository.save(despesa);
    }

    public void deletar(Long id) {
        despesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada!"));
        despesaRepository.deleteById(id);
    }

    public String gerarPlanoQuitacao(Long usuarioId, BigDecimal valorDisponivel) {
        List<Despesa> dividasNegativadas = despesaRepository
                .findByUsuarioIdAndNegativadaTrue(usuarioId);

        if (dividasNegativadas.isEmpty()) {
            return "Você não possui dívidas negativadas cadastradas!";
        }

        StringBuilder plano = new StringBuilder();
        plano.append("Plano de quitação das suas dívidas negativadas:\n\n");

        dividasNegativadas.forEach(divida -> {
            if (valorDisponivel.compareTo(BigDecimal.ZERO) > 0) {
                int meses = divida.getValor()
                        .divide(valorDisponivel, 0, RoundingMode.CEILING)
                        .intValue();
                plano.append("• ").append(divida.getNomeCredor())
                        .append(": R$ ").append(divida.getValor())
                        .append(" → quitada em ").append(meses)
                        .append(meses == 1 ? " mês" : " meses")
                        .append(" guardando R$ ").append(valorDisponivel)
                        .append("/mês\n");
            }
        });

        return plano.toString();
    }
}


