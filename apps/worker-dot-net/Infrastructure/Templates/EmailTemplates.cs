namespace ServiceWorker.Infrastructure.Templates;

public static class EmailTemplates
{
    public static string BuildMagicLinkTemplate(string magicLinkUrl)
    {
        return $@"
        <!DOCTYPE html>
        <html lang=""pt-BR"">
        <head>
            <meta charset=""UTF-8"">
            <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
            <title>Seu Acesso ao Portal</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; color: #F3F4F6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }}
                .wrapper {{ max-width: 520px; margin: 40px auto; padding: 32px; background-color: #111827; border-radius: 16px; border: 1px solid #1F2937; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }}
                .logo {{ font-size: 20px; font-weight: 800; color: #10B981; letter-spacing: -0.5px; text-transform: uppercase; margin-bottom: 32px; }}
                h1 {{ font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0 0 16px 0; letter-spacing: -0.5px; }}
                p {{ font-size: 15px; line-height: 24px; color: #9CA3AF; margin: 0 0 24px 0; }}
                .btn {{ display: inline-block; background-color: #10B981; color: #FFFFFF !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 8px; text-align: center; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }}
                .footer {{ margin-top: 32px; padding-top: 24px; border-top: 1px solid #1F2937; font-size: 12px; line-height: 18px; color: #6B7280; }}
                .link-fallback {{ word-break: break-all; color: #10B981; text-decoration: none; }}
            </style>
        </head>
        <body>
            <div class=""wrapper"">
                <div class=""logo"">✨ SkinSaaS</div>
                <h1>Seu relatório está pronto!</h1>
                <p>Olá! Seu diagnóstico personalizado de textura de pele e o plano de 4 semanas foram gerados com sucesso por nossa IA.</p>
                <p>Clique no botão abaixo para autenticar sua conta de forma segura e prosseguir para o pagamento via Pix.</p>
                
                <div style=""margin: 32px 0; text-align: center;"">
                    <a href=""{magicLinkUrl}"" class=""btn"">Entrar no Aplicativo</a>
                </div>

                <p style=""font-size: 13px;"">Este link é válido por 15 minutos. Se o botão não funcionar, copie e cole o endereço abaixo no seu navegador:</p>
                <p style=""font-size: 13px;""><a href=""{magicLinkUrl}"" class=""link-fallback"">{magicLinkUrl}</a></p>

                <div class=""footer"">
                    Esta é uma mensagem automática. Se você não solicitou este acesso, por favor desconsidere este e-mail.<br>
                    <strong>SkinSaaS Proteção de Dados</strong> • Em conformidade estrita com a LGPD.
                </div>
            </div>
        </body>
        </html>";
    }
}
