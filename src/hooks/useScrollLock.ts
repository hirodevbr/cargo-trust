import { useEffect, useRef } from 'react';

/**
 * Hook para gerenciar scroll em modais do Stellar Design System
 * Corrige problemas de navegação e scroll travado
 */
export const useScrollPreservation = (isModalOpen: boolean) => {
  const scrollY = useRef<number>(0);
  const hasModal = useRef<boolean>(false);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isModalOpen && !hasModal.current) {
      // Modal abrindo - salvar posição e preparar
      scrollY.current = window.scrollY || window.pageYOffset || 0;
      hasModal.current = true;
      
      // Garantir que não há classes problemáticas
      body.classList.remove('modal-open');
      
    } else if (!isModalOpen && hasModal.current) {
      // Modal fechando - limpeza completa
      hasModal.current = false;
      
      // Limpar todas as classes e estilos problemáticos
      const cleanupModal = () => {
        body.classList.remove('modal-open');
        body.style.removeProperty('overflow');
        body.style.removeProperty('overflow-x');
        body.style.removeProperty('overflow-y');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('left');
        body.style.removeProperty('right');
        body.style.removeProperty('width');
        body.style.removeProperty('height');
        body.style.removeProperty('padding-right');
        
        html.style.removeProperty('overflow');
        html.style.removeProperty('overflow-x');
        html.style.removeProperty('overflow-y');
        
        // Restaurar scroll
        window.scrollTo({
          top: scrollY.current,
          left: 0,
          behavior: 'auto'
        });
      };
      
      // Executar limpeza múltiplas vezes para garantir
      cleanupModal();
      setTimeout(cleanupModal, 50);
      setTimeout(cleanupModal, 200);
    }
  }, [isModalOpen]);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      const body = document.body;
      const html = document.documentElement;
      
      body.classList.remove('modal-open');
      body.style.removeProperty('overflow');
      body.style.removeProperty('position');
      html.style.removeProperty('overflow');
    };
  }, []);
};

// Exportar também com o nome antigo para compatibilidade
export const useScrollLock = useScrollPreservation;
