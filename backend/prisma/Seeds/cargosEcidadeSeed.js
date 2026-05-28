"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../../src/database/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var cargos, _i, cargos_1, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Iniciando a seed de Cargos do e-Cidade...');
                    cargos = [
                        { value: '1', cargo: 'INATIVO' },
                        { value: '4', cargo: 'COORD/ASSES PEDAGÓGICO(A)' },
                        { value: '5', cargo: 'DIRETOR(A)' },
                        { value: '7', cargo: 'DIRETOR(A) ADJUNTO(A)' },
                        { value: '8', cargo: 'AUXILIAR DE SECRETARIA' },
                        { value: '9', cargo: 'SECRETÁRIO ESCOLAR' },
                        { value: '12', cargo: 'INSPETOR DE ALUNOS' },
                        { value: '13', cargo: 'COORD.DE TURNO READAPTADO' },
                        { value: '14', cargo: 'COORDENADOR(A) GERAL' },
                        { value: '15', cargo: 'SERVENTE - TERCEIRIZADO' },
                        { value: '16', cargo: 'MANIP. DE ALIMENTOS TERC.' },
                        { value: '17', cargo: 'AUX. DE BIBLIOTECA READAP' },
                        { value: '19', cargo: 'AUX DE CRECHE TERCEIRIZAD' },
                        { value: '20', cargo: 'ORIENTADOR PEDAGÓGICO' },
                        { value: '22', cargo: 'MONITOR ATIV.COMPLEMENTAR' },
                        { value: '25', cargo: 'PORTEIRO NOTURNO' },
                        { value: '29', cargo: 'MOTORISTA' },
                        { value: '30', cargo: 'PORTEIRO DIURNO' },
                        { value: '31', cargo: 'MONITOR S/R' },
                        { value: '32', cargo: 'MONITOR HORÁRIO INTEGRAL' },
                        { value: '34', cargo: 'ARTICULADOR MAIS EDUCAÇÃO' },
                        { value: '35', cargo: 'INTERPRETE DE LIBRAS' },
                        { value: '36', cargo: 'INST. DE SURDOS' },
                        { value: '40', cargo: 'AUXILIAR LICENÇA' },
                        { value: '44', cargo: 'MEDIADOR PEDAGÓGICO' },
                        { value: '45', cargo: 'MEDIADOR PEDAG - AUTISTA' },
                        { value: '46', cargo: 'AGENTE CULTURAL' },
                        { value: '47', cargo: 'CEDIDO - SAE' },
                        { value: '48', cargo: 'READAPTADO - CEDIDO SAE' },
                        { value: '50', cargo: 'PERMUTADO - MARICÁ' },
                        { value: '53', cargo: 'CEDIDO SINDICATO' },
                        { value: '55', cargo: 'INSPETOR LICENÇA' },
                        { value: '57', cargo: 'PROF RECURSO / ATV COMPLE' },
                        { value: '58', cargo: 'EM AFASTAMENTO' },
                        { value: '61', cargo: 'DOCENTE - PROJETO' },
                        { value: '63', cargo: 'PROFESSOR(A) SUBSTITUTO' },
                        { value: '64', cargo: 'COORDENADOR EDUC.INTEGRAL' },
                        { value: '65', cargo: 'ASSESSOR' },
                        { value: '66', cargo: 'INTERPRETE CEDIDO SAE' },
                        { value: '69', cargo: 'INSPETOR ALUNO ABANDONO' },
                        { value: '74', cargo: 'AGENTE DE SEGURANÇA' },
                        { value: '75', cargo: 'LICENÇA SEM VENCIMENTO' },
                        { value: '77', cargo: 'SERVENTE CEDIDO SAE' },
                        { value: '78', cargo: 'NUTRICIONISTA' },
                        { value: '82', cargo: 'INSPETOR ESCOLAR' },
                        { value: '84', cargo: 'CEDIDO' },
                        { value: '85', cargo: 'FONOAUDIOLOGO CEDIDO' },
                        { value: '86', cargo: 'FONOAUDIOLOGO' },
                        { value: '87', cargo: 'COORD. ADMINISTRATIVO' },
                        { value: '88', cargo: 'CEDIDO PARA OUTRO ENTE' },
                        { value: '89', cargo: 'VOLANTE' },
                        { value: '90', cargo: 'TERAPEUTA CEDIDA' },
                        { value: '91', cargo: 'SERVENTE LSV' },
                        { value: '92', cargo: 'ASSISTENTE EDUCACIONAL' },
                        { value: '93', cargo: 'ASSESOR CEDIDO OUTRA SEC' },
                        { value: '94', cargo: 'SE SUB EXECUTIVA' },
                        { value: '95', cargo: 'SE GABINETE' },
                        { value: '96', cargo: 'SE FINANÇAS' },
                        { value: '97', cargo: 'SE ASS. GABINETE' },
                        { value: '98', cargo: 'ASSESSOR ADM- TRANSPORTE' },
                        { value: '99', cargo: 'SE SUB EXEC - PATRIMÔNIO' },
                        { value: '100', cargo: 'SE NUTRIÇÃO' },
                        { value: '101', cargo: 'SE INFRAESTRUTURA' },
                        { value: '102', cargo: 'SE EVENTOS' },
                        { value: '103', cargo: 'SE RECEPÇÃO' },
                        { value: '104', cargo: 'SE ENSINO' },
                        { value: '105', cargo: 'ASSESSOR ADM- PROGRAMAS' },
                        { value: '106', cargo: 'DOCENTE II' },
                        { value: '107', cargo: 'DOC II 3 HORAS' },
                        { value: '108', cargo: 'DOC I LÍNGUA PORTUGUESA' },
                        { value: '109', cargo: 'DOC I ARTE' },
                        { value: '110', cargo: 'DOC I EDUCAÇÃO FÍSICA' },
                        { value: '111', cargo: 'DOC I INGLÊS' },
                        { value: '112', cargo: 'DOC I MATEMÁTICA' },
                        { value: '113', cargo: 'DOC I CIÊNCIAS' },
                        { value: '114', cargo: 'DOC I GEOGRAFIA' },
                        { value: '115', cargo: 'DOC I HISTÓRIA' },
                        { value: '116', cargo: 'DOC II OFICINA' },
                        { value: '117', cargo: 'EM PROCESSO DE EXONERAÇÃO' },
                        { value: '118', cargo: 'PROFESSOR(A) APD' },
                        { value: '119', cargo: 'MEDIADOR PED. SUBSTITUTO' },
                        { value: '120', cargo: 'APOIO PEDAGOGICO' },
                        { value: '123', cargo: 'AUXILIAR INDÍGENA' },
                        { value: '124', cargo: 'ASSESSOR GERENTE FG9' },
                        { value: '125', cargo: 'ASSESSOR COMPLEMENTAR 15H' },
                        { value: '126', cargo: 'PERMUTADO E CEDIDO' },
                        { value: '127', cargo: 'EM PROCESSO DE ABANDONO' },
                        { value: '128', cargo: 'AUX. DE SECRETARIA READAP' },
                        { value: '129', cargo: 'APOIO ADMINISTRATIVO TERC' },
                        { value: '130', cargo: 'DOC II - RCH' },
                        { value: '131', cargo: 'DOC I ARTE - RCH' },
                        { value: '132', cargo: 'DOC I CIÊNCIAS - RCH' },
                        { value: '133', cargo: 'DOC I EDUC FÍS - RCH' },
                        { value: '134', cargo: 'DOC I GEOGRAFIA - RCH' },
                        { value: '135', cargo: 'DOC I HISTÓRIA - RCH' },
                        { value: '136', cargo: 'DOC I INGLÊS - RCH' },
                        { value: '137', cargo: 'DOC I LÍNGUA PORT. RCH' },
                        { value: '138', cargo: 'DOC I MATEMÁTICA - RCH' },
                        { value: '139', cargo: 'SE SUB EXEC - TI' },
                        { value: '140', cargo: 'ASSESSOR ADM- RH' },
                        { value: '142', cargo: 'ASSESSOR ADM- ARQUIVO' },
                        { value: '143', cargo: 'ASSESSOR ADM- OUVIDORIA' },
                        { value: '144', cargo: 'SE SUB EXEC - INSPEÇÃO ES' },
                        { value: '145', cargo: 'FUNÇÕES ADM' },
                        { value: '146', cargo: 'PROFESSOR INDÍGENA' },
                        { value: '147', cargo: 'SECRETÁRIO' },
                        { value: '148', cargo: 'PROJETO POSSIBILIDADES' },
                        { value: '149', cargo: 'DOC I OFICINA' },
                        { value: '150', cargo: 'AUX. DE SECRETARIA (D)' },
                        { value: '152', cargo: 'ASSESSOR - A' },
                        { value: '153', cargo: 'ASSESSOR - I' },
                        { value: '154', cargo: 'COORDENADOR DE TURNO' },
                        { value: '155', cargo: 'INSP. DE ALUNO - RCH' },
                        { value: '156', cargo: 'AGENTE ADMINISTRATIVO' },
                        { value: '157', cargo: 'O.E - RCH' },
                        { value: '159', cargo: 'ASSESSOR - PASSAPORTE' },
                        { value: '160', cargo: 'O.P - RCH' },
                        { value: '161', cargo: 'AUXILIAR DE CRECHE' },
                        { value: '162', cargo: 'PSICOLOGO' },
                        { value: '163', cargo: 'AUX. DE SECRETARIA RCH' },
                        { value: '164', cargo: 'ASSISTENTE SOCIAL' },
                        { value: '165', cargo: 'TERAPEUTA OCUPACIONAL' },
                        { value: '166', cargo: 'INST. LING. ALEMA' },
                        { value: '167', cargo: 'INST. LING. FRANCESA' },
                        { value: '168', cargo: 'INST. LING. ESPANHOL' },
                        { value: '169', cargo: 'INST. LING. MANDARIM' },
                        { value: '170', cargo: 'INST. LING. INGLESA' },
                        { value: '171', cargo: 'INST. LING. GUARANI' },
                        { value: '172', cargo: 'AGENTE DES. EDUCACIONAL' },
                        { value: '173', cargo: 'AGENTE INCLUSÃO-CONTRATO' },
                        { value: '174', cargo: 'SUPERVISOR' },
                        { value: '175', cargo: 'LICENÇA PREMIO' },
                        { value: '176', cargo: 'INST. PORT. E MAT.' },
                        { value: '177', cargo: 'INST. LING. PORTUGUESA' },
                        { value: '178', cargo: 'INST. MATEMATICA' },
                        { value: '179', cargo: 'INST. ATIV. ARTISTICA' },
                        { value: '180', cargo: 'INST. ATIV. ESPORTIVA' },
                        { value: '181', cargo: 'INST. SOC. E CULT.' },
                        { value: '182', cargo: 'INST. TECNOLOGIA' },
                        { value: '183', cargo: 'APOIO ESCOLAR (CONTRATO)' },
                        { value: '184', cargo: 'APOIO ESC INCLUSAO TERC' },
                        { value: '185', cargo: 'APOIO ESC/TRANSP CONTRATO' },
                        { value: '186', cargo: 'SUBSECRETARIO (A)' },
                        { value: '187', cargo: 'LICENÇA ACOMP. CONJUGE' },
                        { value: '188', cargo: 'TECNICO CONTABILIDADE' },
                        { value: '189', cargo: 'DOC I PROD TEXTUAL' },
                        { value: '191', cargo: 'AG. DE PROJETO REC. APREN' },
                        { value: '192', cargo: 'FACILITADOR DE INCLUSÃO' },
                        { value: '193', cargo: 'AGENTE DES. INFANTIL' },
                        { value: '194', cargo: 'ESTOQUISTA' },
                        { value: '195', cargo: 'TECNICO DE ENFERMAGEM' },
                        { value: '196', cargo: 'ENFERMEIRO' },
                        { value: '200', cargo: 'PSICOPEDAGOGO' },
                        { value: '202', cargo: 'ENGENHEIRO CIVIL' },
                        { value: '203', cargo: 'ENGENHEIRO ELETRICISTA' },
                        { value: '204', cargo: 'ENGENHEIRO DE PRODUÇAO' },
                        { value: '205', cargo: 'TOPOGRAFO' },
                        { value: '206', cargo: 'INST. PQO CABELEREIRO' },
                        { value: '207', cargo: 'INST. PQO MANICURE' },
                        { value: '208', cargo: 'INST. PQO BARBEARIA' },
                        { value: '209', cargo: 'INST, PQO HOTEL/TURISMO' },
                        { value: '210', cargo: 'INST. PQO REFRIGERAÇAO' },
                        { value: '211', cargo: 'ARQUITETO' },
                        { value: '212', cargo: 'REVISÃO' },
                        { value: '215', cargo: 'COPEIRA DE LACTÁRIO' },
                        { value: '216', cargo: 'COPEIRA' },
                        { value: '217', cargo: 'AUXILIAR DE ALMOXARIFADO' },
                        { value: '218', cargo: 'COZINHEIRO' },
                        { value: '219', cargo: 'ENCARREGADO' },
                        { value: '220', cargo: 'AUXILIAR DE BIBLIOTECA' },
                        { value: '221', cargo: 'AUX. BIBLIOTECA - RCH' },
                        { value: '222', cargo: 'DOC I FILOSOFIA' }
                    ];
                    _i = 0, cargos_1 = cargos;
                    _a.label = 1;
                case 1:
                    if (!(_i < cargos_1.length)) return [3 /*break*/, 4];
                    item = cargos_1[_i];
                    return [4 /*yield*/, prisma_1.prisma.cargosEcidade.create({
                            data: {
                                value: Number(item.value),
                                cargo: item.cargo
                            }
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('✅ Seed de cargos finalizada com sucesso!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Erro ao rodar a seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
