package br.com.organizafacil.api.repository;

import br.com.organizafacil.api.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long>{
    List<Receita> findByUsuarioId(Long usuarioId);
    void deleteAllByUsuarioId(Long usuarioId);
}
