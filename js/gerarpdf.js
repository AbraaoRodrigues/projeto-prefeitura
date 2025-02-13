function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho e título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PREFEITURA MUNICIPAL DE AGUDOS", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text("Praça Tiradentes, 650 - Centro - Agudos/SP - CEP: 17120-009", 105, 20, null, null, "center");
    doc.text("CNPJ: 46.137.444/0001-74", 105, 25, null, null, "center");
    doc.setFontSize(16);
    doc.text("DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA", 105, 40, null, null, "center");

    // Dados principais
    const setorSolicitante = document.getElementById("setor").value;
    const tipoSolicitacao = document.getElementById("tipo_solicitacao").options[document.getElementById("tipo_solicitacao").selectedIndex].text;
    const modalidade = document.getElementById("modalidade").options[document.getElementById("modalidade").selectedIndex].text;

    const campos = [
        ["Setor Solicitante:", setorSolicitante],
        ["Tipo de Solicitação:", tipoSolicitacao],
        ["Modalidade:", modalidade],
        ["Valor Estimado:", document.getElementById("valor_estimado").value],
        ["Forma de Pagamento:", document.getElementById("forma_pagamento").value],
        ["Prazo de Execução:", document.getElementById("prazo_execucao").value],
    ];

    let y = 50;
    campos.forEach(([titulo, valor]) => {
		doc.setFontSize(12);
        doc.text(titulo, 10, y);
        doc.setFont("helvetica", "normal");
        doc.text(valor, 70, y);
        doc.setFont("helvetica", "bold");
        y += 7;
    });

    // Justificativa
doc.setFont("helvetica", "bold");
doc.text("Justificativa:", 10, y);
y += 7; //Espaço entre o título e o texto da justificativa
doc.setFont("helvetica", "normal");

// Quebra o texto da justificativa em linhas
const justificativaTexto = document.getElementById("justificativa").value;
const justificativaLinhas = doc.splitTextToSize(justificativaTexto, 190);

// Adiciona cada linha da justificativa e ajusta 'y' dinamicamente
justificativaLinhas.forEach((linha) => {
    doc.text(linha, 10, y);
    y += 7; // Avança a linha para evitar sobreposição
});


    // Tabela de Itens Solicitados
const tabela = document.getElementById("tabela-itens");
const rows = Array.from(tabela.querySelectorAll("tbody tr"));
doc.setFont("helvetica", "bold");
doc.text("Itens Solicitados", 10, y);
y += 10;

const headers = ["Nº", "Descrição dos Serviços", "Qtde", "Und.", "Valor Unit.", "Total"];
const colWidths = [10, 80, 20, 20, 30, 30];
const startX = 12; // Ajuste para iniciar mais à direita
const rowHeight = 7; // Altura de cada linha na tabela

// Desenhar borda superior da tabela
doc.line(startX, y, startX + colWidths.reduce((a, b) => a + b, 0), y);

// Desenhar cabeçalho da tabela
let x = startX;
headers.forEach((header, i) => {
    doc.text(header, x + 2, y + rowHeight - 2); // Título um pouco abaixo da linha superior
    x += colWidths[i];
});

// Linha horizontal abaixo do cabeçalho
y += rowHeight;
doc.line(startX, y, startX + colWidths.reduce((a, b) => a + b, 0), y);

// Dados da tabela
doc.setFont("helvetica", "normal");
let paginaAtual = 1; // Página inicial
const maxAltura = 240; // Altura máxima antes de quebrar a página
const margemTopo = 20;
const margemRodape = 285;

// Função para desenhar o cabeçalho
function desenharCabecalho(doc, startX, startY, colWidths, headers) {
    let x = startX;
    headers.forEach((header, i) => {
        doc.text(header, x + 2, startY + 10); // Centraliza os textos no cabeçalho
        x += colWidths[i];
    });

    // Linha horizontal abaixo do cabeçalho
    doc.line(startX, startY + 12, startX + colWidths.reduce((a, b) => a + b, 0), startY + 12);
}

rows.forEach((row, index) => {
    x = startX;

    const cells = [
        String(index + 1),
        row.querySelector(".descricao").value || "",
        row.querySelector(".quantidade").value || "",
        row.querySelector(".unidade").value || "",
        row.querySelector(".valor-unitario").value || "",
        row.querySelector(".total").value || "",
    ];

    // Verifica se precisa de uma nova página
    if (y + rowHeight > maxAltura) {
        // Adiciona o rodapé na página atual
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text(
            "Praça Tiradentes – Nº 650, Centro CEP: 17.120-009 – Fone: (14) 3262-8500 – e-mail: gabinete@agudos.sp.gov.br",
            105,
            margemRodape,
            null,
            null,
            "center"
        );

        // Adiciona uma nova página e incrementa o número da página
        doc.addPage();
        paginaAtual++;
        y = margemTopo;

        // Redesenha o cabeçalho na nova página
        desenharCabecalho(doc, startX, y, colWidths, headers);

        // Adiciona o número da página no canto superior direito
        doc.setFont("helvetica", "normal");
        doc.text(`Página ${paginaAtual}`, 200, 10, null, null, "right");

        y += rowHeight; // Ajusta a posição Y após desenhar o cabeçalho
    }

    // Desenha as células da linha atual
    cells.forEach((cell, i) => {
        doc.text(cell, x + 2, y + rowHeight - 2);
        x += colWidths[i];
    });

    // Linha horizontal abaixo da linha de dados
    y += rowHeight;
    doc.line(startX, y, startX + colWidths.reduce((a, b) => a + b, 0), y);
});

// Desenha as linhas verticais da tabela
x = startX;
colWidths.forEach((width) => {
    doc.line(x, margemTopo, x, y); // Alinha com o início da página e a última linha desenhada
    x += width;
});

// Linha vertical final
doc.line(x, margemTopo, x, y);

// Adiciona o rodapé na última página
doc.setFont("helvetica", "italic");
doc.setFontSize(10);
doc.text(
    "Praça Tiradentes – Nº 650, Centro CEP: 17.120-009 – Fone: (14) 3262-8500 – e-mail: gabinete@agudos.sp.gov.br",
    105,
    margemRodape,
    null,
    null,
    "center"
);

    // Despacho
    const despacho = document.getElementById("despacho").value;
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Despacho do Prefeito", 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(despacho, 10, y + 5, { maxWidth: 190 });

    // Assinaturas
    y += 30;
    doc.setFont("helvetica", "bold");
    doc.text("Rafael Lima Fernandes", 50, y);
    doc.text("Prefeito Municipal", 50, y + 5);
	const secretario = document.getElementById("secretario").value;
	doc.text(`${secretario}`, 110, y);
    doc.text("Secretário", 110, y + 5);
	
	// Adicionar rodapé no PDF
doc.setFont("helvetica", "italic");
doc.setFontSize(10);
doc.text("Praça Tiradentes – Nº 650, Centro CEP: 17.120-009 – Fone: (14) 3262-8500 – e-mail: gabinete@agudos.sp.gov.br", 105, 285, null, null, "center");


    // Salvar o PDF
    doc.save("documento_formalizacao.pdf");
}

document.getElementById("btn-gerar-pdf").addEventListener("click", gerarPDF);
