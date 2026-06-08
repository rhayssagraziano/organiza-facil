package br.com.organizafacil.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "TB_DESPESA")
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "despesa_seq")
    @SequenceGenerator(name = "despesa_seq", sequenceName = "SEQ_DESPESA", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private String tipo; // FIXA, VARIAVEL, PARCELA, DIVIDA

    @Column
    private String categoria; // livre — ex: Aluguel, Fatura Nubank, Notebook...

    @Column(nullable = false)
    private Integer diaVencimento;

    // Campos de parcela — só preenchidos quando tipo = PARCELA
    @Column(name = "total_parcelas")
    private Integer totalParcelas;

    @Column(name = "parcela_atual")
    private Integer parcelaAtual;

    @Column(name = "valor_parcela")
    private BigDecimal valorParcela;

    // Campos de dívida — só preenchidos quando tipo = DIVIDA
    @Column(name = "valor_original")
    private BigDecimal valorOriginal;

    @Column(name = "nome_credor")
    private String nomeCredor; // ex: "Serasa - Loja X", "SPC - Banco Y"

    @Column(name = "negativada")
    private Boolean negativada = false;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getDiaVencimento() { return diaVencimento; }
    public void setDiaVencimento(Integer diaVencimento) { this.diaVencimento = diaVencimento; }

    public Integer getTotalParcelas() { return totalParcelas; }
    public void setTotalParcelas(Integer totalParcelas) { this.totalParcelas = totalParcelas; }

    public Integer getParcelaAtual() { return parcelaAtual; }
    public void setParcelaAtual(Integer parcelaAtual) { this.parcelaAtual = parcelaAtual; }

    public BigDecimal getValorParcela() { return valorParcela; }
    public void setValorParcela(BigDecimal valorParcela) { this.valorParcela = valorParcela; }

    public BigDecimal getValorOriginal() { return valorOriginal; }
    public void setValorOriginal(BigDecimal valorOriginal) { this.valorOriginal = valorOriginal; }

    public String getNomeCredor() { return nomeCredor; }
    public void setNomeCredor(String nomeCredor) { this.nomeCredor = nomeCredor; }

    public Boolean getNegativada() { return negativada; }
    public void setNegativada(Boolean negativada) { this.negativada = negativada; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}