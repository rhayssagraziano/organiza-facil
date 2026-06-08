package br.com.organizafacil.api.service;

import br.com.organizafacil.api.model.Objetivo;
import br.com.organizafacil.api.repository.ObjetivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.organizafacil.api.model.Despesa;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ObjetivoService {

    @Autowired
    private ObjetivoRepository objetivoRepository;

    public List<Objetivo> listarTodos() {
        return objetivoRepository.findAll();
    }

    public List<Objetivo> listarPorUsuario(Long usuarioId) {
        return objetivoRepository.findByUsuarioId(usuarioId);
    }

    public List<Objetivo> listarPorPrioridade(Long usuarioId, String prioridade) {
        return objetivoRepository.findByUsuarioIdAndPrioridade(usuarioId, prioridade);
    }

    public Optional<Objetivo> buscarPorId(Long id) {
        return objetivoRepository.findById(id);
    }

    public Objetivo criarObjetivoDeDivida(Despesa despesa) {
        Objetivo objetivo = new Objetivo();
        objetivo.setNome("Quitar: " + despesa.getNomeCredor());
        objetivo.setValorMeta(despesa.getValor());
        objetivo.setValorAtual(BigDecimal.ZERO);
        objetivo.setPrazoMeses(12);
        objetivo.setPrioridade("ALTA");
        objetivo.setTipo("QUITACAO_DIVIDA");
        objetivo.setUsuario(despesa.getUsuario());
        return objetivoRepository.save(objetivo);
    }

    public Objetivo salvar(Objetivo objetivo) {
        //Regra valor atual nao pode ser maior do que a meta
        if (objetivo.getValorAtual().compareTo(objetivo.getValorMeta()) > 0) {
            throw new RuntimeException("Valor atual não pode ser maior que a meta!");
        }
        return objetivoRepository.save(objetivo);
    }

    public Objetivo atualizar(Long id, Objetivo objetivoAtualizado) {
        Objetivo objetivo = objetivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Objetivo não encontrado!"));
        objetivo.setNome(objetivoAtualizado.getNome());
        objetivo.setValorMeta(objetivoAtualizado.getValorMeta());
        objetivo.setValorAtual(objetivoAtualizado.getValorAtual());
        objetivo.setPrazoMeses(objetivoAtualizado.getPrazoMeses());
        objetivo.setPrioridade(objetivoAtualizado.getPrioridade());
        objetivo.setTipo(objetivoAtualizado.getTipo());
        return objetivoRepository.save(objetivo);
    }

    public void deletar(Long id) {
        objetivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Objetivo não encontrado!"));
        objetivoRepository.deleteById(id);
    }
}
