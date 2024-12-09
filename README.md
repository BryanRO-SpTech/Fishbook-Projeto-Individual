# Fishbook

Bem-vindo ao Fishbook, a rede social criada para apaixonados por pesca e pelo mundo marinho. Esta plataforma permite aos usuários interagir, compartilhar momentos de pesca, explorar informações sobre peixes e suas localizações, além de se conectar com outros pescadores e serviços relacionados. O projeto foi desenvolvido com foco em pescadores brasileiros, mas com potencial para expansão futura.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# Índice
2. [Funcionalidades Principais](#funcionalidades-principais)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Configuração Inicial](#configuração-inicial)
7. [Contato](#contato)

## Funcionalidades Principais

### 1. Rede Social de Pesca
- Compartilhamento de fotos e vídeos de pescarias.
- Feed com postagens de amigos, amigos de amigos e pescadores populares.
- Sistema de curtidas e comentários nas postagens.

### 2. Mapeamento de Áreas Preservadas
- Identificação de regiões protegidas para conservação da fauna marinha.
- Alertas sobre áreas de pesca proibida ou restrita.

### 3. Reserva de Vagas em Barcos de Pesca
- Catálogo de barcos disponíveis com informações detalhadas sobre preços.
- Sistema de reservas integrado diretamente na plataforma.

## Tecnologias Utilizadas

### Backend
- **Node.js** com **Express** para a API.
- **MySQL** para gerenciamento de banco de dados relacional.
- **Multer** para upload de imagens.
- **FFmpeg** para tratamento de vídeos.

### Frontend
- HTML, CSS e JavaScript puro.
- **CropperJS** para recorte de imagens.

### Hospedagem
- Servidor Linux Lubuntu rodando em uma VM hospedada em um servidor físico Windows.

## Estrutura do Projeto

### Diretórios Principais
- `src/` - Contém a API e lógicas de negócio.
- `views/` - Contém os arquivos HTML.
- `public/` - Armazena os arquivos estáticos, css e scripts do frontend.
- `uploads/` - Contém imagens e vídeos processados.
- `temp_uploads/` - Precisa ser criada ao baixar o projeto, é onde o multer guarda videos antes de serem processados pelo FFmpeg.

### Configuração Inicial

1. Clone o repositório:
   ```bash
   git clone https://github.com/BryanRO-SpTech/Fishbook-Projeto-Individual.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   ```
   - Crie um banco de dados MySQL.
   - Execute os scripts CREATE_TABLE e CREATE_VIEW localizado em `/src/database` para criar as tabelas e view.
   ```

4. Configure arquivo .env:
   ```
   - Substitua as credenciais do banco de dados pelas suas credenciais.
   - Cria suas próprias `SECRET` para `CRYPTO_SECRET` e `COOKIE_SECRET`.
   ```

5. Crie o diretório `temp_uploads`:
  ```
   - Certifique-se de criar a pasta no diretório raíz do projeto (Mesmo diretório da pasta uploads).
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. Acessar:
   - Acesse a rota `/login` no navegador.

## Contato

Para dúvidas ou sugestões, entre em contato:
- **Email:** bryan.grocha@sptech.school
- **GitHub:** [Fishbook Repository]([https://github.com/fishbook](https://github.com/BryanRO-SpTech/Fishbook-Projeto-Individual))

