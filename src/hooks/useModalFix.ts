import { useEffect, useRef } from 'react';

/**
 * Hook específico para corrigir problemas com modais do Stellar Design System
 * Monitora e corrige problemas de scroll/navegação automaticamente
 */
export const useModalFix = (isOpen: boolean) => {
  const savedScrollY = useRef<number>(0);
  const isModalActive = useRef<boolean>(false);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Função para forçar limpeza de estilos problemáticos
    const forceCleanup = () => {
      // Remover classes que podem bloquear scroll
      body.classList.remove('modal-open', 'no-scroll', 'overflow-hidden');
      
      // Remover todos os estilos inline que podem interferir
      const problematicStyles = [
        'overflow', 'overflow-x', 'overflow-y', 'position', 'top', 'left', 
        'right', 'bottom', 'width', 'height', 'max-width', 'max-height',
        'padding-right', 'margin-right', 'transform'
      ];
      
      problematicStyles.forEach(style => {
        body.style.removeProperty(style);
        html.style.removeProperty(style);
      });

      // Garantir que o scroll funciona
      body.style.overflow = '';
      html.style.overflow = '';
    };

    if (isOpen && !isModalActive.current) {
      // Modal abrindo
      savedScrollY.current = window.scrollY || 0;
      isModalActive.current = true;
      
      // Preventivo: limpar qualquer coisa que possa interferir
      forceCleanup();
      
    } else if (!isOpen && isModalActive.current) {
      // Modal fechando
      isModalActive.current = false;
      
      // Limpeza agressiva múltipla
      const performCleanup = () => {
        forceCleanup();
        
        // Restaurar posição do scroll
        window.scrollTo({
          top: savedScrollY.current,
          left: 0,
          behavior: 'auto'
        });
      };

      // Executar limpeza imediatamente e com delays
      performCleanup();
      setTimeout(performCleanup, 0);
      setTimeout(performCleanup, 50);
      setTimeout(performCleanup, 100);
      setTimeout(performCleanup, 250);
    }
  }, [isOpen]);

  // Limpeza final ao desmontar o componente
  useEffect(() => {
    return () => {
      const body = document.body;
      const html = document.documentElement;
      
      body.classList.remove('modal-open', 'no-scroll', 'overflow-hidden');
      body.style.overflow = '';
      html.style.overflow = '';
      
      // Garantir que o scroll funciona
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);
};
