package br.com.organizafacil.api.repository;
import br.com.organizafacil.api.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {
    List<Despesa> findByUsuarioId(Long usuarioId);
    List<Despesa> findByUsuarioIdAndTipo(Long usuarioId, String tipo);
    List<Despesa> findByUsuarioIdAndNegativadaTrue(Long usuarioId);
    void deleteAllByUsuarioId(Long usuarioId);
}
