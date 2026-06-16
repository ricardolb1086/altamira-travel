#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera propuesta PDF con membrete Altamira Travel
Cliente: Nomada Excursiones Viajes por el Mundo
Programa: Peru Gastronomico · 15 enero 2027
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
import os

# ═══ COLORES ALTAMIRA ═══
CREAM   = colors.HexColor('#F5F0E8')
INK     = colors.HexColor('#2E2820')
TERRA   = colors.HexColor('#C47646')
TERRA2  = colors.HexColor('#A85E32')
LINE    = colors.HexColor('#DDD8CE')
WHITE   = colors.white
INKSOFT = colors.HexColor('#6B5E52')
GREEN   = colors.HexColor('#1a7a3e')

W, H = letter  # 612 x 792 pts

# ═══ ESTILOS ═══
def styles():
    base = ParagraphStyle
    return {
        'overline': base('overline', fontName='Helvetica', fontSize=7.5,
                         textColor=TERRA, letterSpacing=2.5, leading=12,
                         spaceAfter=4),
        'h1': base('h1', fontName='Helvetica-Bold', fontSize=26,
                   textColor=INK, leading=30, spaceAfter=4),
        'h2': base('h2', fontName='Helvetica-Bold', fontSize=15,
                   textColor=INK, leading=20, spaceBefore=16, spaceAfter=6),
        'h3': base('h3', fontName='Helvetica-Bold', fontSize=11,
                   textColor=TERRA, leading=15, spaceBefore=10, spaceAfter=4),
        'body': base('body', fontName='Helvetica', fontSize=9.5,
                     textColor=INK, leading=15, spaceAfter=3),
        'body_soft': base('body_soft', fontName='Helvetica', fontSize=9,
                          textColor=INKSOFT, leading=14, spaceAfter=2),
        'bullet': base('bullet', fontName='Helvetica', fontSize=9.2,
                       textColor=INK, leading=14, leftIndent=14,
                       firstLineIndent=-10, spaceAfter=3),
        'price': base('price', fontName='Helvetica-Bold', fontSize=28,
                      textColor=TERRA, leading=32, alignment=TA_CENTER),
        'price_label': base('price_label', fontName='Helvetica', fontSize=8.5,
                            textColor=INKSOFT, leading=12, alignment=TA_CENTER),
        'center': base('center', fontName='Helvetica', fontSize=9,
                       textColor=INK, leading=14, alignment=TA_CENTER),
        'day_title': base('day_title', fontName='Helvetica-Bold', fontSize=10,
                          textColor=WHITE, leading=14),
        'day_sub': base('day_sub', fontName='Helvetica', fontSize=8,
                        textColor=CREAM, leading=12),
        'footer': base('footer', fontName='Helvetica', fontSize=7.5,
                       textColor=INKSOFT, leading=11, alignment=TA_CENTER),
        'tag': base('tag', fontName='Helvetica-Bold', fontSize=7.5,
                    textColor=TERRA, leading=10),
    }

S = styles()

# ═══ HEADER / FOOTER EN CADA PÁGINA ═══
def on_page(canvas, doc):
    canvas.saveState()
    # Línea terracota superior
    canvas.setFillColor(TERRA)
    canvas.rect(0, H - 4, W, 4, fill=1, stroke=0)
    # Banda header crema
    canvas.setFillColor(CREAM)
    canvas.rect(0, H - 52, W, 48, fill=1, stroke=0)
    # Logo texto
    canvas.setFillColor(INK)
    canvas.setFont('Helvetica-Bold', 13)
    canvas.drawString(0.55*inch, H - 34, 'ALTA')
    canvas.setFillColor(TERRA)
    canvas.drawString(0.55*inch + 33, H - 34, 'MIRA')
    canvas.setFillColor(INK)
    canvas.setFont('Helvetica', 7.5)
    canvas._charSpace = 2.5
    canvas.drawString(0.55*inch, H - 46, 'TRAVEL')
    canvas._charSpace = 0
    # Línea separadora header
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.55*inch, H - 52, W - 0.55*inch, H - 52)
    # Texto derecho header
    canvas.setFillColor(INKSOFT)
    canvas.setFont('Helvetica', 7.5)
    canvas.drawRightString(W - 0.55*inch, H - 34, 'PROPUESTA COMERCIAL · CONFIDENCIAL')
    canvas.drawRightString(W - 0.55*inch, H - 46, 'altamiratravel.com')

    # Footer
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, W, 36, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(0.55*inch, 36, W - 0.55*inch, 36)
    canvas.setFillColor(INKSOFT)
    canvas.setFont('Helvetica', 7)
    canvas.drawString(0.55*inch, 22, 'Altamira Travel · Miami, Florida · USA · hola@altamiratravel.com · +1 (888) 855-1889')
    canvas.drawRightString(W - 0.55*inch, 22, f'Pag. {doc.page}')
    canvas.setFont('Helvetica', 6.5)
    canvas.drawCentredString(W/2, 10, 'Tarifas sujetas a disponibilidad  ·  Minimo 12 pasajeros  ·  IGV no incluido')
    canvas.restoreState()


def on_first_page(canvas, doc):
    canvas.saveState()
    # Franja superior oscura (hero)
    canvas.setFillColor(INK)
    canvas.rect(0, H - 200, W, 200, fill=1, stroke=0)
    # Acento terracota izquierdo
    canvas.setFillColor(TERRA)
    canvas.rect(0, H - 200, 5, 200, fill=1, stroke=0)
    # ALTAMIRA TRAVEL en hero
    canvas.setFillColor(CREAM)
    canvas.setFont('Helvetica-Bold', 16)
    canvas._charSpace = 4
    canvas.drawString(0.6*inch, H - 56, 'ALTAMIRA')
    canvas.setFillColor(TERRA)
    canvas.drawString(0.6*inch + 100, H - 56, 'TRAVEL')
    canvas._charSpace = 0
    # Línea terracota
    canvas.setStrokeColor(TERRA)
    canvas.setLineWidth(1)
    canvas.line(0.6*inch, H - 68, 2.2*inch, H - 68)
    # Overline
    canvas.setFillColor(TERRA)
    canvas.setFont('Helvetica', 8)
    canvas._charSpace = 2
    canvas.drawString(0.6*inch, H - 84, 'PROPUESTA COMERCIAL')
    canvas._charSpace = 0
    # Titulo programa
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 30)
    canvas.drawString(0.6*inch, H - 122, 'Peru Gastronomico')
    # Subtitulo itálico
    canvas.setFillColor(CREAM)
    canvas.setFont('Helvetica', 12)
    canvas.drawString(0.6*inch, H - 142, '12 dias · 11 noches · Lima · Chiclayo · Ica · Arequipa · Colca · Amazonia')
    # Para: cliente
    canvas.setFillColor(TERRA)
    canvas.setFont('Helvetica-Bold', 8.5)
    canvas._charSpace = 1.5
    canvas.drawString(0.6*inch, H - 168, 'PREPARADO PARA:')
    canvas._charSpace = 0
    canvas.setFillColor(CREAM)
    canvas.setFont('Helvetica', 10)
    canvas.drawString(0.6*inch, H - 183, 'Nomada Excursiones Viajes por el Mundo')
    # Fecha derecha
    canvas.setFillColor(CREAM)
    canvas.setFont('Helvetica', 8)
    canvas.drawRightString(W - 0.6*inch, H - 168, 'Inicio: 15 Enero 2027')
    canvas.drawRightString(W - 0.6*inch, H - 183, 'Regreso: 26 Enero 2027')
    # Footer
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, W, 36, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(0.55*inch, 36, W - 0.55*inch, 36)
    canvas.setFillColor(INKSOFT)
    canvas.setFont('Helvetica', 7)
    canvas.drawString(0.55*inch, 22, 'Altamira Travel · Miami, Florida · USA · hola@altamiratravel.com · +1 (888) 855-1889')
    canvas.drawRightString(W - 0.55*inch, 22, 'Pag. 1')
    canvas.setFont('Helvetica', 6.5)
    canvas.drawCentredString(W/2, 10, 'Tarifas sujetas a disponibilidad  ·  Minimo 12 pasajeros  ·  IGV no incluido')
    canvas.restoreState()


# ═══ HELPERS ═══
def hr(color=LINE, thickness=0.5):
    return HRFlowable(width='100%', thickness=thickness, color=color, spaceAfter=8, spaceBefore=4)

def terra_hr():
    return HRFlowable(width='100%', thickness=1.5, color=TERRA, spaceAfter=10, spaceBefore=6)

def section_title(text):
    return [
        Spacer(1, 6),
        Paragraph(text.upper(), S['overline']),
        Paragraph(text, S['h2']),
        terra_hr(),
    ]

def bullet(text):
    return Paragraph(f'<bullet>&bull;</bullet> {text}', S['bullet'])

def day_block(dia_num, fecha, ciudad, titulo, items, incluye):
    elems = []
    # Cabecera del día con fondo oscuro
    header_data = [[
        Paragraph(f'DIA {dia_num}', S['day_title']),
        Paragraph(fecha, S['day_sub']),
        Paragraph(ciudad.upper(), S['day_title']),
        Paragraph(titulo, S['day_sub']),
    ]]
    header_table = Table(header_data, colWidths=[0.7*inch, 1.1*inch, 1.4*inch, 3.9*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), INK),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LINEAFTER', (0,0), (2,-1), 0.5, colors.HexColor('#444038')),
    ]))
    elems.append(header_table)
    # Bullets
    for item in items:
        elems.append(bullet(item))
    # Incluye
    elems.append(Paragraph(f'<b>Incluye:</b> {incluye}', S['body_soft']))
    elems.append(hr())
    return KeepTogether(elems)


# ═══ CONSTRUIR PDF ═══
def build():
    out = '/Users/ricardolazobarrueto/Desktop/Propuesta_Peru_Gastronomico_Altamira.pdf'

    doc = BaseDocTemplate(
        out,
        pagesize=letter,
        leftMargin=0.55*inch,
        rightMargin=0.55*inch,
        topMargin=0.75*inch,
        bottomMargin=0.6*inch,
    )

    # Frame para primera página (más margen top por hero)
    frame_first = Frame(doc.leftMargin, doc.bottomMargin,
                        W - doc.leftMargin - doc.rightMargin,
                        H - 215 - doc.bottomMargin,
                        id='first')
    frame_normal = Frame(doc.leftMargin, doc.bottomMargin,
                         W - doc.leftMargin - doc.rightMargin,
                         H - 72 - doc.bottomMargin,
                         id='normal')

    doc.addPageTemplates([
        PageTemplate(id='First', frames=frame_first, onPage=on_first_page),
        PageTemplate(id='Later', frames=frame_normal, onPage=on_page),
    ])

    story = []

    # ═══════════════════════════════════════════
    # PÁGINA 1 — RESUMEN EJECUTIVO
    # ═══════════════════════════════════════════
    story.append(Spacer(1, 10))
    story.append(Paragraph('RESUMEN DEL PROGRAMA', S['overline']))
    story.append(Spacer(1, 6))

    # Ficha técnica en tabla
    ficha = [
        ['INICIO', '15 de enero 2027', 'REGRESO', '26 de enero 2027'],
        ['DURACION', '12 dias / 11 noches', 'GRUPO', 'Minimo 12 personas'],
        ['ALOJAMIENTO', 'Hoteles 4* + desayuno', 'LODGE', '2 noches todo incluido'],
        ['VUELOS DOM.', '5 vuelos incluidos Peru', 'VUELOS INT.', 'No incluidos (cliente gestiona)'],
    ]
    t = Table(ficha, colWidths=[1.1*inch, 2.3*inch, 1.2*inch, 2.5*inch])
    t.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR', (0,0), (0,-1), TERRA),
        ('TEXTCOLOR', (2,0), (2,-1), TERRA),
        ('TEXTCOLOR', (1,0), (1,-1), INK),
        ('TEXTCOLOR', (3,0), (3,-1), INK),
        ('BACKGROUND', (0,0), (-1,0), CREAM),
        ('BACKGROUND', (0,2), (-1,2), CREAM),
        ('ROWBACKGROUND', (0,0), (-1,-1), [WHITE, CREAM]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('LINEBELOW', (0,-1), (-1,-1), 0.5, LINE),
        ('LINEABOVE', (0,0), (-1,0), 0.5, LINE),
        ('BOX', (0,0), (-1,-1), 0.5, LINE),
        ('INNERGRID', (0,0), (-1,-1), 0.3, LINE),
    ]))
    story.append(t)
    story.append(Spacer(1, 16))

    # PRECIO DESTACADO
    price_data = [[
        Paragraph('USD 3,900', S['price']),
        Paragraph('USD 600', S['price']),
    ],[
        Paragraph('por persona en habitacion doble', S['price_label']),
        Paragraph('suplemento individual', S['price_label']),
    ]]
    pt = Table(price_data, colWidths=[3.6*inch, 3.5*inch])
    pt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), INK),
        ('BACKGROUND', (1,0), (1,-1), CREAM),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, TERRA),
        ('LINEAFTER', (0,0), (0,-1), 1, TERRA),
    ]))
    story.append(pt)
    story.append(Spacer(1, 16))

    # RUTA
    story.append(Paragraph('RUTA DEL CIRCUITO', S['overline']))
    ruta = [['LIMA', '→', 'CHICLAYO', '→', 'LIMA', '→', 'ICA/PARACAS', '→', 'AREQUIPA', '→', 'COLCA', '→', 'IQUITOS', '→', 'AMAZONIA']]
    rt = Table(ruta, colWidths=[0.6*inch]*16)
    rt.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7),
        ('TEXTCOLOR', (0,0), (-1,-1), INK),
        ('TEXTCOLOR', (1,0), (1,0), TERRA),
        ('TEXTCOLOR', (3,0), (3,0), TERRA),
        ('TEXTCOLOR', (5,0), (5,0), TERRA),
        ('TEXTCOLOR', (7,0), (7,0), TERRA),
        ('TEXTCOLOR', (9,0), (9,0), TERRA),
        ('TEXTCOLOR', (11,0), (11,0), TERRA),
        ('TEXTCOLOR', (13,0), (13,0), TERRA),
        ('TEXTCOLOR', (15,0), (15,0), TERRA),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('BACKGROUND', (0,0), (-1,-1), CREAM),
        ('BOX', (0,0), (-1,-1), 0.5, LINE),
    ]))
    story.append(rt)
    story.append(Spacer(1, 14))

    # EXPERIENCIAS GASTRONOMICAS
    story.append(Paragraph('EXPERIENCIAS GASTRONOMICAS DESTACADAS', S['overline']))
    exp_data = [
        ['LIMA', 'Mercado Surquillo · Clase de cocina limena · Chocolate artesanal y cafe de especialidad'],
        ['CALLAO', 'Cebicheria en La Punta · Origenes multiculturales de la cocina peruana'],
        ['CHICLAYO', 'Taller de King Kong · Mercado Moshoqueque · Cabrito norteno · Cena lambayecana'],
        ['ICA / PARACAS', 'Cata tecnica de pisco en Hacienda La Caravedo · Islas Ballestas · Taller de tejas'],
        ['ICA (TACAMA)', 'Vinedos historicos · Cata de vinos con maridaje · Almuerzo en hacienda'],
        ['AREQUIPA', 'Picanteria autentica · Mercado San Camilo · Convento Santa Catalina · Chicheria de guinapo'],
        ['COLCA / CHIVAY', 'Mercado andino · Productos de altura · Almuerzo local autentico'],
        ['AMAZONIA', 'Mercado de Belen · Clase de cocina amazonica · Cata de frutos silvestres · Cocteleria jungle'],
    ]
    et = Table(exp_data, colWidths=[1.3*inch, 5.8*inch])
    et.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR', (0,0), (0,-1), TERRA),
        ('TEXTCOLOR', (1,0), (1,-1), INK),
        ('ROWBACKGROUND', (0,0), (-1,-1), [WHITE, CREAM]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, LINE),
        ('INNERGRID', (0,0), (-1,-1), 0.3, LINE),
    ]))
    story.append(et)

    # ═══════════════════════════════════════════
    # PÁGINAS 2-4 — ITINERARIO DÍA A DÍA
    # ═══════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph('PROGRAMA DIA A DIA', S['overline']))
    story.append(Paragraph('Itinerario detallado', S['h2']))
    story.append(terra_hr())

    dias = [
        (1, 'Jue 15 enero', 'Lima', 'LLEGADA · BIENVENIDA CULINARIA',
         ['Traslado privado aeropuerto Jorge Chavez al Hotel 4* Miraflores',
          'Cena de bienvenida tematica: introduccion a los 4 ejes de la cocina peruana (costa, sierra, selva, Lima moderna)',
          'Maridaje con pisco artesanal y chicha morada',
          'Presentacion del circuito gastronomico por guia especializado'],
         'traslado aeropuerto-hotel, cena de bienvenida tematica y alojamiento'),

        (2, 'Vie 16 enero', 'Lima', 'SURQUILLO · CLASE DE COCINA · BARRANCO',
         ['Mercado de Surquillo N1: recorrido con cocinero-guia — ajies, tuberculos nativos, hierbas, pescados frescos',
          'Clase de cocina limena (3 horas): ceviche clasico, leche de tigre, causa rellena y pisco sour',
          'Almuerzo con lo preparado en clase',
          'Tarde en Barranco: chocolateria artesanal, cervezas artesanales y cafe de especialidad'],
         'desayuno, guia-cocinero local, minibus privado, clase de cocina 3h, almuerzo, chocolateria y traslados'),

        (3, 'Sab 17 enero', 'Lima - Callao', 'CALLAO MONUMENTAL · LA PUNTA · ORIGENES',
         ['Callao Monumental: Fortaleza del Real Felipe, arte urbano, memoria portuaria',
          'Contexto gastronomico: el puerto como puerta de migraciones italiana, china, japonesa y africana',
          'Visita al muelle de pescadores artesanales de Chucuito',
          'Almuerzo en La Punta: cebicheria frente al mar con pescados de temporada'],
         'desayuno, guia local, minibus privado, almuerzo La Punta y traslados'),

        (4, 'Dom 18 enero', 'Lima a Chiclayo', 'VUELO · KING KONG · MOSHOQUEQUE · PIMENTEL',
         ['Vuelo temprano LIM-CIX (LATAM/Sky, ~06:00h)',
          'Taller artesanal de King Kong: elaboracion activa de manjarblanco, galleta y armado',
          'Mercado Moshoqueque: ajies del norte, chicha de jora, algarrobina y cafe de Jaen',
          'Almuerzo: cabrito norteno, causa de cangrejo, ceviche de conchas negras',
          'Puerto de Pimentel: caballitos de totora y atardecer en el malecon',
          'Cena lambayecana: arroz con pato, tortilla de raya y chicha de jora'],
         'desayuno Lima, vuelo LIM-CIX, taller King Kong, almuerzo, traslados, cena y alojamiento'),

        (5, 'Lun 19 enero', 'Chiclayo a Lima', 'MUSEO SIPAN · CHICHA DE JORA · VUELO',
         ['Museo Tumbas Reales del Senor de Sipan: ofrendas alimentarias y ritual de la chicha Moche',
          'Sesion de chicha de jora con productor local: proceso artesanal y diferencias regionales',
          'Compras gastronomicas: King Kong, algarrobina, cafe, aji seco norteno',
          'Traslado aeropuerto · vuelo CIX-LIM tarde'],
         'desayuno, entrada Museo Sipan, sesion chicha de jora, vuelo CIX-LIM y traslados'),

        (6, 'Mar 20 enero', 'Lima a Ica/Paracas', 'BALLESTAS · PISCO · HACIENDA LA CARAVEDO',
         ['Salida por Panamericana Sur hacia Paracas (~3.5h en minibus privado)',
          'Islas Ballestas: lobos marinos, pinguinos de Humboldt, aves guaneras y el Candelabro',
          'Hacienda La Caravedo: tour historico de destileria y proceso artesanal del pisco',
          'Cata vertical tecnica de 5 variedades: quebranta, italia, torontel, albilla, acholado'],
         'desayuno Lima, traslado Lima-Paracas, Islas Ballestas, tour + cata La Caravedo y alojamiento'),

        (7, 'Mie 21 enero', 'Ica a Arequipa', 'TACAMA · TALLER TEJAS · VUELO',
         ['Hacienda Tacama: vinedo mas antiguo de America del Sur — bodega historica y vinificacion',
          'Almuerzo en hacienda con vinos de produccion propia y maridaje',
          'Taller de tejas iqueñas: manjarblanco con pecan o lucuma cubierto de azucar glase',
          'Vuelo LIM-AQP tarde/noche · alojamiento Arequipa'],
         'desayuno hacienda, almuerzo + cata Tacama, taller tejas, vuelo LIM-AQP y traslados'),

        (8, 'Jue 22 enero', 'Arequipa', 'PICANTERIAS · SANTA CATALINA · CHICHERIA',
         ['Picanteria autentica arequipena: adobo, chupe de camarones, chicharron de cabrito y chicha de guinapo',
          'Mercado San Camilo: rocoto, queso de Paria, chuño, moraya, cecina de llama y maiz blanco gigante',
          'Convento Santa Catalina: ciudad colonial con historia de cocina conventual',
          'Miradores de Yanahuara y Cayma · Plaza de Armas',
          'Tarde: chicheria de guinapo — chicha de maiz negro germinado, proceso y cata'],
         'desayuno, guia local, minibus, almuerzo picanteria, entrada Convento Santa Catalina y traslados'),

        (9, 'Vie 23 enero', 'Arequipa a Chivay', 'CANON DEL COLCA · MERCADO ANDINO',
         ['Salida ~06:00h por la Reserva Nacional de Aguada Blanca',
          'Parada Pampa Cañahuas: avistamiento de vicuñas (~4,900 msnm)',
          'Mercado de Chivay: chuño negro y blanco, charqui de llama, queso de Caylloma, hierbas medicinales',
          'Almuerzo local autentico (no buffet turistico): sopa de chuño, alpaca, chicha de maiz morado',
          'Tarde libre: baños termales La Calera (opcional)'],
         'desayuno Arequipa, minibus + guia, Mercado Chivay, almuerzo local y alojamiento'),

        (10, 'Sab 24 enero', 'Colca a Iquitos', 'CONDORES · VUELO · BIENVENIDA AMAZONICA',
         ['05:30h: Cruz del Condor — condores andinos sobrevolando el canon al amanecer',
          'Recorrido pueblos Collagua: terrazas prehispanicas e iglesias coloniales',
          'Vuelo AQP-LIM-IQT tarde · llegada Iquitos',
          'Mercado de Belen: camu camu, cocona, aguaje, cecinas ahumadas y pescados amazonicos',
          'Traslado fluvial al lodge · cena de bienvenida amazonica'],
         'desayuno, tour Canon del Colca + Reserva, almuerzo en ruta, vuelo AQP-LIM-IQT, Mercado Belen y cena lodge'),

        (11, 'Dom 25 enero', 'Amazonia', 'FLORA · FAUNA · GASTRONOMIA NATIVA',
         ['Amanecer en bote: delfines rosados, garzas, martines pescadores, tucanes y loros',
          'Caminata etnogastronomica: camu camu, ungurahui, tecnicas de almidon de yuca',
          'Clase de cocina amazonica 2h: juane en hoja de bijao, tacacho con cecina, coctel de camu camu',
          'Tarde: pesca de pirañas · canoa por quebradas',
          'Cata de 8 frutos amazonicos: acai, cocona, aguaje, carambola, pitahaya y mas',
          'Cocteleria amazonica nocturna: aguajina, chapo, masato con barman del lodge'],
         'todo incluido: alojamiento, 3 comidas, clase de cocina, cata frutos, actividades y guias nativos'),

        (12, 'Lun 26 enero', 'Iquitos a Lima', 'DESPEDIDA · FIN DEL PROGRAMA',
         ['Ultimo desayuno amazonico: jugo de camu camu, pan de yuca, mazamorra de platano y frutas',
          'Traslado fluvial lodge al aeropuerto de Iquitos',
          'Vuelo IQT-LIM ~10:00h · FIN DEL PROGRAMA',
          'Compras en Lima: pisco, cafe, chocolate, aji seco, kiwicha',
          'Pasajeros toman vuelos internacionales de regreso de forma independiente'],
         'desayuno lodge, traslado fluvial, vuelo IQT-LIM y traslado terminal internacional'),
    ]

    for d in dias:
        story.append(day_block(*d))

    # ═══════════════════════════════════════════
    # VUELOS DOMÉSTICOS
    # ═══════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph('VUELOS DOMESTICOS EN PERU', S['overline']))
    story.append(Paragraph('5 vuelos incluidos · LATAM / Sky Airline', S['h2']))
    story.append(terra_hr())

    vuelos = [
        ['DIA / FECHA', 'RUTA', 'HORARIO REF.', 'MOTIVO'],
        ['Dia 4 · Dom 18 enero', 'Lima (LIM) → Chiclayo (CIX)', '~06:00h', 'Inicio norte gastronomico'],
        ['Dia 5 · Lun 19 enero', 'Chiclayo (CIX) → Lima (LIM)', '~18:00h', 'Regreso a Lima'],
        ['Dia 7 · Mie 21 enero', 'Lima (LIM) → Arequipa (AQP)', '~20:00h', 'Inicio sur gastronomico'],
        ['Dia 10 · Sab 24 enero', 'Arequipa (AQP) → Lima (LIM) → Iquitos (IQT)', 'Tarde', 'Conexion Lima · entrada Amazonia'],
        ['Dia 12 · Lun 26 enero', 'Iquitos (IQT) → Lima (LIM)', '~10:00h', 'Retorno y fin del programa'],
    ]
    vt = Table(vuelos, colWidths=[1.5*inch, 2.5*inch, 1.1*inch, 2.0*inch])
    vt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), INK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR', (0,1), (0,-1), TERRA),
        ('TEXTCOLOR', (1,1), (-1,-1), INK),
        ('ROWBACKGROUND', (0,1), (-1,-1), [WHITE, CREAM]),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, LINE),
        ('INNERGRID', (0,0), (-1,-1), 0.3, LINE),
    ]))
    story.append(vt)
    story.append(Spacer(1, 20))

    # ═══════════════════════════════════════════
    # ALOJAMIENTO
    # ═══════════════════════════════════════════
    story.append(Paragraph('ALOJAMIENTO · 11 NOCHES', S['overline']))
    story.append(Paragraph('Hoteles 4 estrellas + Lodge todo incluido', S['h2']))
    story.append(terra_hr())

    aloj = [
        ['DESTINO', 'HOTEL SUGERIDO', 'CAT.', 'NOCHES', 'REGIMEN'],
        ['Lima', 'Estelar / INNSiDE / Dazzler Wyndham Miraflores', '4*', '4', 'Desayuno'],
        ['Chiclayo', 'Hotel Costa del Sol Wyndham', '4*', '1', 'Desayuno'],
        ['Ica', 'Hotel & Hacienda La Caravedo, Valle de Ica', '4*', '1', 'Desayuno'],
        ['Arequipa', 'Casa Andina Select / Katari Hotel', '4*', '2', 'Desayuno'],
        ['Chivay (Colca)', 'Pozo del Cielo / Lodge Valle del Colca', '3*', '1', 'Desayuno'],
        ['Iquitos - Amazonia', 'Lodge Amazonico 4* Reserva Nacional Loreto', '4*', '2', 'TODO INCLUIDO'],
    ]
    at = Table(aloj, colWidths=[1.2*inch, 2.8*inch, 0.6*inch, 0.7*inch, 1.7*inch])
    at.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), INK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('TEXTCOLOR', (0,1), (0,-1), TERRA),
        ('TEXTCOLOR', (1,1), (-1,-1), INK),
        ('ROWBACKGROUND', (0,1), (-1,-1), [WHITE, CREAM]),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, LINE),
        ('INNERGRID', (0,0), (-1,-1), 0.3, LINE),
        # Fila lodge en crema destacada
        ('BACKGROUND', (0,-1), (-1,-1), CREAM),
        ('FONTNAME', (4,-1), (4,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (4,-1), (4,-1), TERRA),
    ]))
    story.append(at)
    story.append(Spacer(1, 20))

    # ═══════════════════════════════════════════
    # INCLUYE / NO INCLUYE
    # ═══════════════════════════════════════════
    story.append(PageBreak())
    story.append(Paragraph('EL PROGRAMA INCLUYE & NO INCLUYE', S['overline']))
    story.append(Paragraph('Detalle de servicios', S['h2']))
    story.append(terra_hr())

    incluye = [
        '5 vuelos domesticos Peru: LIM-CIX, CIX-LIM, LIM-AQP, AQP-LIM-IQT, IQT-LIM (LATAM/Sky)',
        '11 noches de alojamiento en hoteles 4 estrellas con desayuno diario',
        '2 noches Lodge Amazonico 4* todo incluido: alojamiento, 3 comidas, actividades, guias nativos y traslados fluviales',
        'Cena de bienvenida tematica en Lima (Dia 1)',
        'Cena lambayecana en Chiclayo (Dia 4)',
        'Todos los almuerzos indicados en el itinerario (excepto Dia 12)',
        'Clase de cocina limena 3 horas con cocinero local (Dia 2)',
        'Taller artesanal de King Kong en Chiclayo (Dia 4)',
        'Clase de cocina amazonica en lodge (Dia 11)',
        'Cata tecnica de pisco con ficha individual en Hacienda La Caravedo',
        'Taller de tejas iqueñas en Ica',
        'Cata de frutos amazonicos silvestres en lodge',
        'Tour en lancha a Islas Ballestas',
        'Tour historico Hacienda Tacama con cata de vinos y maridaje',
        'Tour full day Canon del Colca con avistamiento de condores',
        'Entradas: Museo Larco, Museo Tumbas Reales Sipan, Islas Ballestas, Convento Santa Catalina, Reserva Nacional Colca',
        'Guias privados locales especializados en gastronomia en cada destino',
        'Minibus privado para traslados, excursiones y aeropuertos durante todo el circuito',
        'Coordinacion logistica completa: reservas, reconfirmaciones y acompañamiento pre-viaje',
    ]

    no_incluye = [
        'Vuelos internacionales — cada pasajero gestiona su llegada/salida del aeropuerto Jorge Chavez (LIM)',
        'Cenas (excepto cena bienvenida Lima Dia 1 y cena Chiclayo Dia 4)',
        'Almuerzo Dia 12 (dia de regreso)',
        'Actividades opcionales: parapente Costa Verde Lima, baños termales Chivay',
        'Equipaje facturado en vuelos domesticos (salvo add-on)',
        'Gastos personales, souvenirs y bebidas alcoholicas fuera de las degustaciones incluidas',
        'Propinas a guias, conductores y personal de lodge',
        'Seguro de viaje (obligatorio — se recomienda contratar antes del viaje)',
        'Vacunas, profilaxis medica y documentos adicionales si aplican',
        'IGV (Impuesto General a las Ventas Peru)',
        'Reservas en restaurantes de alta demanda: Central, Maido u otros (gestion como opcional)',
    ]

    inc_items = [[Paragraph(f'<font color="#1a7a3e"><b>✓</b></font>  {i}', S['body'])] for i in incluye]
    no_items  = [[Paragraph(f'<font color="#cc3333"><b>✗</b></font>  {i}', S['body'])] for i in no_incluye]

    inc_table = Table(inc_items, colWidths=[3.3*inch])
    inc_table.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))

    no_table = Table(no_items, colWidths=[3.3*inch])
    no_table.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))

    header_in = Table([
        [Paragraph('INCLUYE', ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE)),
         Paragraph('NO INCLUYE', ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE))]
    ], colWidths=[3.57*inch, 3.57*inch])
    header_in.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#1a7a3e')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#cc3333')),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(header_in)

    two_col = Table([[inc_table, no_table]], colWidths=[3.57*inch, 3.57*inch])
    two_col.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOX', (0,0), (-1,-1), 0.5, LINE),
        ('LINEAFTER', (0,0), (0,-1), 0.5, LINE),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(two_col)
    story.append(Spacer(1, 16))

    # Nota importante
    nota = Table([[Paragraph(
        '<b>IMPORTANTE:</b> Los vuelos internacionales NO estan incluidos. Cada pasajero debe gestionar '
        'su vuelo de llegada y salida del Aeropuerto Internacional Jorge Chavez (LIM). Se recomienda '
        'llegar la tarde/noche del 14 de enero 2027. El vuelo de regreso puede reservarse a partir '
        'de las 14:00h del 26 de enero 2027.',
        S['body_soft']
    )]], colWidths=[7.14*inch])
    nota.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CREAM),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, TERRA),
        ('LINEBEFORE', (0,0), (0,-1), 3, TERRA),
    ]))
    story.append(nota)
    story.append(Spacer(1, 20))

    # Cierre
    story.append(terra_hr())
    cierre = Table([[
        Paragraph(
            'Esta propuesta ha sido preparada exclusivamente para <b>Nomada Excursiones Viajes por el Mundo</b>. '
            'Valida para salida <b>15 de enero 2027</b> · Precio en habitacion doble: <b>USD 3,900 p/p</b>.<br/>'
            'Para confirmar la reserva o solicitar ajustes, contactar a su asesor Altamira Travel.',
            S['body']
        ),
        Paragraph(
            '<b>Ricardo Lazo</b><br/>Founder &amp; CEO · Altamira Travel<br/>'
            '+1 (888) 855-1889<br/>+1 (786) 977-6948<br/>ricardo@altamiratravel.com',
            ParagraphStyle('sign', fontName='Helvetica', fontSize=8.5,
                          textColor=INK, leading=14, alignment=TA_RIGHT)
        )
    ]], colWidths=[4.2*inch, 2.9*inch])
    cierre.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(cierre)

    doc.build(story)
    print(f'✅ PDF generado: {out}')

build()
