package br.com.organizafacil.api.service;

import br.com.organizafacil.api.model.Receita;
import br.com.organizafacil.api.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    public List<Receita> listarTodos(){
        return receitaRepository.findAll();
    }

    public List<Receita> listaPorUsuario(Long usuarioId){
        return receitaRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Receita> buscarPorId(Long id){
        return receitaRepository.findById(id);
    }

    public Receita salvar(Receita receita){
        return receitaRepository.save(receita);
    }

    public Receita atualizar(Long id, Receita receitaAtualizada){
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Receita não encontrada!"));
        receita.setDescricao(receitaAtualizada.getDescricao());
        receita.setValor(receitaAtualizada.getValor());
        receita.setTipo(receitaAtualizada.getTipo());
        receita.setData(receitaAtualizada.getData());
        return receitaRepository.save(receita);
    }

    public void deletar(Long id){
        receitaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Receita não encontrada!"));
        receitaRepository.deleteById(id);
    }
}
