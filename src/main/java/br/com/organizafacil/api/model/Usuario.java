package br.com.organizafacil.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_USUARIO")
public class Usuario{
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "usuario_seq")
    @SequenceGenerator(name = "usuario_seq", sequenceName = "SEQ_USUARIO", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = true)
    private String fotoUrl;

    //Getter e Setters
    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}

    public String getNome(){return nome;}
    public void setNome(String nome){this.nome = nome;}

    public String getEmail(){return email;}
    public void setEmail(String email){this.email = email;}

    public String getSenha(){return senha;}
    public void setSenha(String senha){this.senha = senha;}

    public String getFotoUrl(){return fotoUrl;}
    public void setFotoUrl(String fotoUrl){this.fotoUrl = fotoUrl;}

}
