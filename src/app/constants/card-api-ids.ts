// Correspondance des cartes acquises avec TCGdex et Cardmarket (établie le 17/11/2026).
// [id de la carte, apiID TCGdex, cardmarketID]
export const cardApiIds: [number, string, number | null][] = [
  [1, 'gym1-4', 274140], // Draco d' Erika
  [3, 'neo4-14', 274666], // Dracolosse lumineux
  [6, 'neo4-63', 274715], // Minidraco
  [11, 'neo4-11', 274663], // Tyranocif obscur
  [12, 'neo1-9', 274409], // Lugia
  [15, 'dpp-DP30', 275521], // Regigigas
  [18, 'dp4-2', 277904], // Cresselia
  [22, 'swsh12-175', 682222], // Regieleki V
  [23, 'sm3-130', 299530], // Tokotoro GX
  [26, 'dp4-105', 278007], // Dialga nv X
  [54, 'sv07-173', 786027], // Terapagos EX
  [70, 'swsh10tg-TG14', 658891], // Sylveroy Cavalier du Froid
  [74, 'neo1-12', 274412], // Pichu
  [78, 'neo1-39', 274439], // Coxyclaque
  [79, 'neo1-27', 274427], // Migalos
  [81, 'base3-10', 273871], // Lokhlass
  [82, 'neo1-41', 274441], // Ecrémeuh
  [83, 'neo1-13', 274413], // Airmure
  [84, 'neo1-75', 274475], // Mimigal
  [85, 'neo1-60', 274460], // Hoothoot
  [86, 'neo1-35', 274435], // Fouinar
  [87, 'neo1-2', 274402], // Azumarill
  [88, 'neo1-3', 274403], // Joliflor
  [91, 'neo1-46', 274446], // Fleurisson
  [92, 'neo1-54', 274453], // Germignon
  [94, 'neo1-11', 274410], // Meganium
  [95, 'neo2-54', 274565], // Insolourdo
  [96, 'neo1-64', 274464], // Demanta
  [97, 'svp-130', 770950], // Scalpereur
  [98, 'ex5-8', 276082], // Jirachi
  [99, 'neo3-54', 274640], // Lippouti
  [101, 'neo4-38', 274690], // Ymphect obscur
  [106, 'neo1-79', 274479], // Marcacrin
  [107, 'neo3-33', 274619], // Volcaropod
  [108, 'neo3-53', 274639], // Limagma
  [109, 'neo1-25', 274425], // Farfuret
  [110, 'neo1-37', 274437], // Granbull
  [112, 'neo1-26', 274426], // Capumain
  [114, 'neo1-65', 274465], // Wattouat
  [115, 'neo1-16', 274416], // Togetic
  [116, 'neo2-40', 274551], // Toudoudou
  [117, 'neo1-20', 274420], // Melo
  [118, 'neo1-42', 274442], // Noarfang
  [123, 'neo4-80', 274732], // Rémoraid
  [128, 'base1-11', 273706], // Nidoking
  [130, 'neo2-9', 274520], // Tartard
  [131, 'base1-25', 273720], // Lamantine
  [134, 'neo1-76', 274476], // Cerfrousse
  [135, 'swsh4-138', 512400], // Rayquaza Amazing
  [136, 'neo1-15', 274415], // Steelix
  [144, 'neo1-67', 274467], // Natu
  [145, 'neo1-1', 274401], // Pharamp
  [146, 'neo1-77', 274477], // Simulabre
  [147, 'neo1-45', 274445], // Maraistre
  [148, 'neo1-82', 274482], // Axoloto
  [149, 'neo1-24', 274424], // Cornèbre
  [150, 'neo3-8', 274594], // Démolosse
  [151, 'neo4-70', 274722], // Embrylex
  [154, 'neo3-28', 274614], // Lainergie
  [155, 'neo1-61', 274461], // Granivol
  [156, 'neo3-52', 274638], // Floravol
  [157, 'neo1-7', 274407], // Cotovol
  [158, 'neo1-78', 274478], // Tournegrin
  [159, 'neo4-72', 274724], // Heliatronc lumineux
  [160, 'neo1-8', 274408], // Hyporoi
  [161, 'neo1-66', 274466], // Marill
  [162, 'ecard2-19', 275056], // Hyporoi
  [163, 'base5-2', 274055], // Arbok Obscur
  [164, 'neo1-71', 274471], // Fouinette
  [165, 'neo1-63', 274463], // Coxy
  [166, 'neo1-55', 274455], // Loupio
  [167, 'neo1-38', 274438], // Lanturn
  [168, 'neo1-52', 274452], // Xatu
  [169, 'neo1-14', 274414], // Roigada
  [171, 'neo1-58', 274458], // Girafarig
  [172, 'neo2-61', 274572], // Pomdepik
  [173, 'neo2-2', 274513], // Foretress
  [174, 'neo3-12', 274598], // Porygon2
  [175, 'neo2-66', 274577], // Débugant
  [176, 'neo2-3', 274514], // Kapoera
  [177, 'neo1-22', 274422], // Elekid
  [179, 'neo2-57', 274568], // Embrylex
  [180, 'neo3-13', 274599], // Raikou
  [182, 'neo3-14', 274600], // Suicune
  [183, 'neo3-3', 274589], // Celebi
  [184, 'neo4-62', 274714], // Octillery obscur
  [185, 'neo4-43', 274695], // Malosse
  [186, 'neo1-43', 274443], // Phanpy
  [187, 'neo1-21', 274421], // Donphan
  [188, 'neo3-36', 274622], // Cochignon
  [191, 'base1-19', 273714], // Triopikeur
  [192, 'base3-21', 273882], // Spectrum
  [197, 'sv04.5-225', 751772], // Superdofin
  [198, 'sm3.5-57', 302194], // Arceus Brillant
  [199, 'smp-SM82', 311417], // Lugia Brillant
  [200, 'sv06-175', 769349], // Phione
  [201, 'swsh12.5-020', 691737], // Dracaufeu Radieux
  [202, 'swsh10-046', 658586], // Amphinobi Radieux
  [203, 'base5-5', 274058], // Dracolosse Obscur
  [204, 'base3-4', 273865], // Dracolosse
  [205, 'base3-2', 273863], // Artikodin
  [206, 'base3-12', 273873], // Sulfura
  [207, 'base3-15', 273876], // Élector
  [208, 'base1-16', 273711], // Électhor
  [209, 'ex9-98', 276609], // Regice Ex
  [210, 'basep-9', 275428], // Mew
  [211, 'basep-14', 275433], // Mewtwo
  [212, 'base1-7', 273702], // Tygnon
  [213, 'smp-SM70', 301164], // Ho-Oh Brillant
  [214, 'sm3.5-40', 302178], // Mew Brillant
  [215, 'base1-22', 273717], // Roucoups
  [216, 'base3-3', 273864], // Metamorph
  [218, 'base3-41', 273902], // Sablaireau
  [219, 'base2-5', 273802], // Kangourex
  [223, 'sv02-259', 715734], // Yuyu Ex
  [224, 'dp2-18', 277647], // Créhelf
  [225, 'neo3-6', 274592], // Entei
  [227, 'base3-40', 273901], // Amonistar
  [228, 'base3-56', 273917], // Tentacool
  [232, 'base1-12', 273707], // Feunard
];
