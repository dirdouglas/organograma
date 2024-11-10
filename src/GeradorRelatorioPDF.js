// GeradorRelatorioPDF.js
import pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

export const gerarRelatorioPDF = (filteredData,empresaNome) => {
    const dataHoraAtual = new Date();
    const dataHoraFormatada = `${dataHoraAtual.toLocaleDateString()} ${dataHoraAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs`;

    const pageMargins = [30, 40, 20, 30];
    const pageWidth = 841.89;
    const lineWidth = pageWidth - pageMargins[0] - pageMargins[2];

    const departamentos = {};
    let totalColaboradores = 0;
    let totalDemitir = 0;
    let totalVagas = 0;

    filteredData
        .sort((a, b) => (a.id_departamento_previsto || '').localeCompare(b.id_departamento_previsto || ''))
        .forEach((colaborador) => {
            const deptoCodigo = colaborador.id_departamento_previsto?.slice(2) || 'Sem Código';
            const deptoDescricao = colaborador.descricao_departamento || 'Sem Descrição';
            const gestor = colaborador.gestor || 'Sem Gestor';

            const deptoChave = `${deptoCodigo} - ${deptoDescricao} (${gestor})`;
            if (!departamentos[deptoChave]) {
                departamentos[deptoChave] = { colaboradores: [], total: 0, aDemitir: 0, restantes: 0, vagas: 0 };
            }
            departamentos[deptoChave].colaboradores.push(colaborador);
            departamentos[deptoChave].total += 1;
            departamentos[deptoChave].aDemitir += colaborador.prev_demissao === 1 ? 1 : 0;
            departamentos[deptoChave].restantes += colaborador.prev_demissao === 0 ? 1 : 0;
            departamentos[deptoChave].vagas += colaborador.prev_vaga === 1 ? 1 : 0;

            totalColaboradores += 1;
            totalDemitir += colaborador.prev_demissao === 1 ? 1 : 0;
            totalVagas += colaborador.prev_vaga === 1 ? 1 : 0;
        });

    const totalPrevisto = totalColaboradores - totalDemitir ;

    const content = [];

    Object.keys(departamentos).forEach((deptoChave) => {
        const { colaboradores, total, aDemitir, restantes, vagas } = departamentos[deptoChave];
        content.push(
            {
                text: deptoChave,
                style: 'departmentHeader',
                margin: [0, 2.5, 0, 1],
            },
            {
                table: {
                    headerRows: 1,
                    widths: [35, 150, '*', '*', 55, 55, '*'],
                    body: [
                        [
                            { text: 'Matrícula', style: 'tableHeader' },
                            { text: 'Nome', style: 'tableHeader' },
                            { text: 'Função Atual', style: 'tableHeader' },
                            { text: 'Departamento Atual', style: 'tableHeader' },
                            { text: 'Admissão', style: 'tableHeader' },
                            { text: 'Data Demissão', style: 'tableHeader' },
                            { text: 'Justificativa', style: 'tableHeader' },
                        ],
                        ...colaboradores.map((colaborador) => [
                            { text: colaborador.matricula || '', style: 'tableBody' },
                            { text: colaborador.nome_colaborador || '', style: 'tableBody' },
                            { text: colaborador.descricao_funcao_atual || '', style: 'tableBody' },
                            { text: colaborador.descricao_departamento || '', style: 'tableBody' },
                            { text: colaborador.data_contratacao ? new Date(colaborador.data_contratacao).toLocaleDateString() : '', style: 'tableBody' },
                            { text: colaborador.data_demissao ? new Date(colaborador.data_demissao).toLocaleDateString() : '', style: 'tableBody' },
                            { text: colaborador.justificativa || '', style: 'tableBody' },
                        ]),
                    ],
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    paddingLeft: () => 1,
                    paddingRight: () => 0.5,
                    paddingTop: () => 0.5,
                    paddingBottom: () => 0.5,
                },
            },
            { text: `Subtotal: ${total} colaboradores | A Demitir: ${aDemitir} | Vagas: ${vagas} | Previstos: ${restantes}`,  style: 'subtotal', margin: [0, 1, 0, 1] },
        );
    });

    content.push(
        { text: '\n' },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: lineWidth, y2: 0, lineWidth: 1 }] },
        { text: '\n' },
        {
            text: `Resumo Final:\nTotal de Colaboradores: ${totalColaboradores} | Total de Demissões: ${totalDemitir} | Total de Vagas: ${totalVagas} | Total Previsto: ${totalPrevisto}`,
            style: 'summary',
            alignment: 'right',
            margin: [0, 5, 0, 10]
        }
    );

    const docDefinition = {
        pageOrientation: 'landscape',
        pageMargins,
        header: () => [
            {
                text: empresaNome + ' - Relatório de Funcionários Previstos',
                style: 'header',
                alignment: 'left',
                margin: [30, 10, 0, 5]
            },
            {
                canvas: [
                    { type: 'line', x1: 30, y1: 0, x2: lineWidth + pageMargins[0], y2: 0, lineWidth: 1 }
                ]
            }
        ],
        content,
        styles: {
            header: { fontSize: 16, bold: true , margin: [30, 5, 0, 2] },
            departmentHeader: { fontSize: 10, bold: true, margin: [0, 5, 0, 2] },
            tableHeader: { bold: true, fontSize: 8, color: 'black' },
            tableBody: { fontSize: 8 },
            subtotal: { fontSize: 10, italics: true, alignment: 'right' },
            summary: { fontSize: 10, bold: true, color: 'black' },
            footer:{ fontSize: 10, bold: true, margin: [0, 40, 0, 2] }
        },
        footer: (currentPage, pageCount) => [
            { canvas: [{ type: 'line', x1: pageMargins[0], y1: 0, x2: lineWidth + pageMargins[0], y2: 0, lineWidth: 0.5, margin: [10, 15, 20, 0] }] },
            {
                text: `Data/Hora: ${dataHoraFormatada} - Página: ${currentPage} de ${pageCount}`,
                alignment: 'right',
                fontSize: 10,
                margin: [10, 5, 20, 0],
            }
        ],
    };

    pdfMake.createPdf(docDefinition).download('Funcionarios_Previstos.pdf');
};
