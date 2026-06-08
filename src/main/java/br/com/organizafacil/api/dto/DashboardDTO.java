package br.com.organizafacil.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {

    // Totais financeiros
    private BigDecimal totalReceitas;
    private BigDecimal totalDespesasFixas;
    private BigDecimal totalDespesasVariaveis;
    private BigDecimal saldoDisponivel;

    private BigDecimal totalDividas;

    // Score financeiro (0 a 1000)
    private Integer score;
    private String classificacaoScore; // CRITICO, REGULAR, BOM, OTIMO

    // Regra 50-30-20
    private BigDecimal idealNecessidades; // 50% da renda
    private BigDecimal idealDesejos;      // 30% da renda
    private BigDecimal idealInvestimentos;// 20% da renda
    private BigDecimal atualNecessidades;
    private BigDecimal atualDesejos;
    private BigDecimal atualInvestimentos;

    // Sugestões personalizadas
    private List<String> sugestoes;

    // Getters e Setters
    public BigDecimal getTotalReceitas() { return totalReceitas; }
    public void setTotalReceitas(BigDecimal totalReceitas) { this.totalReceitas = totalReceitas; }

    public BigDecimal getTotalDespesasFixas() { return totalDespesasFixas; }
    public void setTotalDespesasFixas(BigDecimal totalDespesasFixas) { this.totalDespesasFixas = totalDespesasFixas; }

    public BigDecimal getTotalDespesasVariaveis() { return totalDespesasVariaveis; }
    public void setTotalDespesasVariaveis(BigDecimal totalDespesasVariaveis) { this.totalDespesasVariaveis = totalDespesasVariaveis; }

    public BigDecimal getSaldoDisponivel() { return saldoDisponivel; }
    public void setSaldoDisponivel(BigDecimal saldoDisponivel) { this.saldoDisponivel = saldoDisponivel; }

    public BigDecimal getTotalDividas() { return totalDividas; }
    public void setTotalDividas(BigDecimal totalDividas) { this.totalDividas = totalDividas; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getClassificacaoScore() { return classificacaoScore; }
    public void setClassificacaoScore(String classificacaoScore) { this.classificacaoScore = classificacaoScore; }

    public BigDecimal getIdealNecessidades() { return idealNecessidades; }
    public void setIdealNecessidades(BigDecimal idealNecessidades) { this.idealNecessidades = idealNecessidades; }

    public BigDecimal getIdealDesejos() { return idealDesejos; }
    public void setIdealDesejos(BigDecimal idealDesejos) { this.idealDesejos = idealDesejos; }

    public BigDecimal getIdealInvestimentos() { return idealInvestimentos; }
    public void setIdealInvestimentos(BigDecimal idealInvestimentos) { this.idealInvestimentos = idealInvestimentos; }

    public BigDecimal getAtualNecessidades() { return atualNecessidades; }
    public void setAtualNecessidades(BigDecimal atualNecessidades) { this.atualNecessidades = atualNecessidades; }

    public BigDecimal getAtualDesejos() { return atualDesejos; }
    public void setAtualDesejos(BigDecimal atualDesejos) { this.atualDesejos = atualDesejos; }

    public BigDecimal getAtualInvestimentos() { return atualInvestimentos; }
    public void setAtualInvestimentos(BigDecimal atualInvestimentos) { this.atualInvestimentos = atualInvestimentos; }

    public List<String> getSugestoes() { return sugestoes; }
    public void setSugestoes(List<String> sugestoes) { this.sugestoes = sugestoes; }
}
