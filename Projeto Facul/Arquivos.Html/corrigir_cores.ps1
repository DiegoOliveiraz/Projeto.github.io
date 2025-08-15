# PowerShell Script para corrigir cores e adicionar redes sociais nas páginas

$pages = @("legal.html", "politicas.html", "acessibilidade.html")

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "Corrigindo $page..."
        
        # Lê o conteúdo do arquivo
        $content = Get-Content -Path $page -Raw -Encoding UTF8
        
        # Corrige navegação
        $content = $content -replace '\.navegacao a \{[^}]*color: var\(--primary-color\);[^}]*\}[^}]*\.navegacao a:hover \{[^}]*\}', 
@'
.navegacao a {
        color: #ffffff !important;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s ease;
      }

      [data-theme="light"] .navegacao a {
        color: #000000 !important;
      }

      .navegacao a:hover {
        color: var(--primary-color) !important;
      }
'@
        
        # Corrige rodapé
        $content = $content -replace '\.rodape-coluna a \{[^}]*color: var\(--text-color\);[^}]*\}[^}]*\.rodape-coluna a:hover \{[^}]*\}',
@'
.rodape-coluna a {
        color: #ffffff;
        text-decoration: none;
        font-size: 0.9rem;
        opacity: 0.8;
        transition: all 0.3s ease;
      }

      [data-theme="light"] .rodape-coluna a {
        color: #000000 !important;
      }

      .rodape-coluna a:hover {
        color: var(--primary-color) !important;
        opacity: 1;
      }
'@
        
        # Salva o arquivo
        $content | Set-Content -Path $page -Encoding UTF8
        Write-Host "$page corrigido!"
    }
}

Write-Host "Todas as páginas foram corrigidas!"
