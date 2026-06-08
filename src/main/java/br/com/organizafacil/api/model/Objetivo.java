package br.com.organizafacil.api.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "TB_OBJETIVO")
public class Objetivo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "objetivo_seq")
    @SequenceGenerator(name = "objetivo_seq", sequenceName = "SEQ_OBJETIVO", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal valorMeta;

    @Column(nullable = false)
    private BigDecimal valorAtual;

    @Column(nullable = false)
    private Integer prazoMeses;

    @Column(nullable = false)
    private String prioridade; //ALTA, MEDIA, BAIXA

    @Column(nullable = false)
    private String tipo; // NORMAL, QUITACAO_DIVIDA

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    //Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getValorMeta() {
        return valorMeta;
    }

    public void setValorMeta(BigDecimal valorMeta) {
        this.valorMeta = valorMeta;
    }

    public BigDecimal getValorAtual() {
        return valorAtual;
    }

    public void setValorAtual(BigDecimal valorAtual) {
        this.valorAtual = valorAtual;
    }

    public Integer getPrazoMeses() {
        return prazoMeses;
    }

    public void setPrazoMeses(Integer prazoMeses) {
        this.prazoMeses = prazoMeses;
    }

    public String getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
