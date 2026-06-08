package br.com.organizafacil.api.repository;

import br.com.organizafacil.api.model.Objetivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObjetivoRepository extends JpaRepository<Objetivo,Long>{
    List<Objetivo> findByUsuarioId(Long usuarioId);
    List<Objetivo> findByUsuarioIdAndPrioridade(Long usuarioId, String prioridade);
    void deleteAllByUsuarioId(Long usuarioId);
}
