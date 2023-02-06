import { getDetailsMessage, getLimitSizeDetails, getSegmentData, makeLine, readYaml } from './utils'
import { CNAB_YAML_DIR } from './const'

/**
 * ARQUIVO RETORNO
 * @param {*} files
 * @param {*} cnabtype
 * @param {*} bankcode
 */
export const parseRemessaCnab = (
  fileStructure: any,
  cnabtype = 400,
  bankcode = '237',
  returnFile: { split: (arg0: string) => void }
) => {
  try {
    const yamls: any = [],
      pathBaseYaml = `${CNAB_YAML_DIR}/cnab${cnabtype}/${bankcode}/retorno`
    let dataIndex: number = 0,
      nextNode = null

    const returnLines: any = returnFile.split('\n')
    for (const key in fileStructure) {
      if (!returnLines[dataIndex])
        // caso não haja mais dados
        return

      switch (key) {
        case 'headers':
          nextNode = 'details'
          break
        case 'details':
          nextNode = 'trailer'
          break
        default:
          /* TRAILERS */
          nextNode = ''
          break
      }

      const segmentValues = fileStructure[key]
      let limitSizeDetails = getLimitSizeDetails(returnLines, fileStructure, nextNode)
      let segmentData = getSegmentData({
        returnLines,
        segmentValues,
        dataIndex,
        limitSizeDetails,
        pathBaseYaml
      })
      yamls.push({ ...segmentData.data })
      dataIndex = segmentData.currentPosition + 1
    }

    const convertedFileData = yamls.map((lineData: any) => {
      const line = makeLine(lineData.layout, lineData.data)
      return line
    })

    return convertedFileData
  } catch (e) {
    console.error(`parseRemessaCnab: `, e)
  }
}

export const parseEventMessage = (linesData: any = [], cnabtype = 240, bankcode = '237') => {
  try {
    /*
      40a => 03 => Entrada Rejeitada | 26 => Instrução Rejeitada | 30 => Alteração de Dados Rejeitada
      40c => 06 => Liquidação        | 09 => Baixa               | 17 => Liquidação após Baixa ou Liquidação de Boleto não Registrado | 
             93 => Baixa Operacional | 94 => Cancelamento de Baixa Operacional
    */
    const type40a = ['03', '26', '30']
    const type40c = ['06', '09', '17', '93', '94']

    if (!linesData || linesData.length === 0) return []

    const eventCodes = readYaml(
      CNAB_YAML_DIR + `/cnab${cnabtype}/${bankcode}/retorno/ocorrencias.yml`
    )

    return linesData.map((line: any) => {
      const message: any = {}
      let messageDetails: any[] = []
      let detailCodes,
        eventCodesTable = ''

      const code = line.codigo_ocorrencia
      if (code) {
        // define mensagem principal
        message.descricao = eventCodes.movimento[code]

        // códigos que descrevem melhor a ocorrência (40a e 40c - Nota 40)
        detailCodes = line.identificacao_rejeicao

        if (type40a.includes(code)) {
          // rejeições
          eventCodesTable = eventCodes.rejeicao
        } else if (type40c.includes(code)) {
          // liquidações/baixas
          if (code === '06')
            // Liquidação
            eventCodesTable = eventCodes.liquidacao
          else eventCodesTable = eventCodes.baixa
        }

        // retorna as mensagens de rejeição/informação/alerta, baseado na ocorrência
        messageDetails = getDetailsMessage(detailCodes, eventCodesTable)
        if (messageDetails.length > 0) {
          message.details = messageDetails
        }

        return {
          ...line,
          mensagens_ocorrencia: { ...message }
        }
      }
    })
  } catch (e) {
    console.error(`parseEventMessage: `, e)
  }
}
