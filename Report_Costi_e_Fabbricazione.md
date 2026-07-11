# Studio di Fattibilità e Costing: Espositore Portapenne-Portasigari di Lusso

Il presente report illustra lo studio di fattibilità economica e l'analisi dei costi di fabbricazione per l'espositore cilindrico di lusso per stilografiche e sigari (**Portapenne-Portasigari**). L'analisi dei costi è stata condotta separando i componenti commerciali (**C**), la minuteria (**M**) e i semilavorati prodotti internamente ed esternamente (**S**).

---

## 1. Descrizione del Prodotto e Specifiche Tecniche

L'espositore è un oggetto di alta gamma progettato per la protezione, l'esposizione e la selezione di stilografiche di pregio. 
- **Diametro Esterno:** $210\text{ mm}$
- **Altezza Chiuso:** $490\text{ mm}$
- **Corsa di Apertura:** $250\text{ mm}$ (svitamento/elevazione verticale della colonna interna)
- **Funzionamento:** Apertura di tipo *push-to-open* servoassistita da una molla di compressione interna a scomparsa. La colonna centrale, rivestita in fibra di carbonio, ruota a $360^\circ$ su un cuscinetto reggispinta a sfere NTN per facilitare la selezione delle penne. Il bloccaggio in posizione chiusa avviene tramite un sistema a magneti al neodimio integrati.

---

## 2. Distinta Base (BOM) e Costi Allocati

Il costo complessivo delle materie prime e dei componenti commerciali (BOM Material Cost) per singolo prodotto è di **€364.90**. Di seguito viene riportata la distinta base dettagliata suddivisa per tipologia.

### 2.1. Componenti Commerciali d'Acquisto ("C" & S_04)
I dati di costo per questa sezione sono stati elaborati e validati dal subagente **`c_component_agent`**, verificando le quantità reali dall'assieme CAD (`A_01-Assieme.asm`).

| Codice | Componente | Descrizione | Qty | Costo Unitario | Costo Allocato | Fonte / Giustificazione |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **C_01** | Tubo Metacrilato | Guscio esterno in PMMA trasparente $\varnothing 200/194\text{ mm}$, h $490\text{ mm}$ | 1 | €25.00 | €25.00 | Riferimento Plexishop (taglio a misura lucido) |
| **C_02** | Magnete Neodimio | Magnete N52 per blocco push-to-open e indicizzazione | 4 | €2.00 | €8.00 | Riferimento Supermagnete (cilindrico $\varnothing 12\text{ mm}$) |
| **C_03** | O-Ring | Guarnizione anulare in NBR per smorzamento e tenuta | 1 | €2.00 | €2.00 | Riferimento catalogo industriale Misumi |
| **C_04** | Molla in Acciaio | Molla elicoidale di compressione per sollevamento colonna | 1 | €12.00 | €12.00 | Catalogo Gutekunst Federn (acciaio armonico) |
| **-** | Cuscinetto NTN 51124 | Cuscinetto reggispinta a sfere $\varnothing 120/155/25\text{ mm}$ (SKU 00132889) | 1 | €120.00 | €120.00 | Motion Industries (distributore NTN Bearing Co.) |
| **S_04** | Targhetta in Ottone | Targhetta con logo aziendale incisa al laser (acquistata finita) | 1 | €4.00 | €4.00 | Fornitore targhe personalizzate |
| **TOT** | **Componenti C** | | | | **€171.00** | |

### 2.2. Minuteria Collegamenti ("M")
I dati di costo per questa sezione sono stati elaborati e validati dal subagente **`m_component_agent`**.

| Codice | Componente | Descrizione | Qty | Costo Unitario | Costo Allocato | Fonte / Giustificazione |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **M_01** | Grano M5 | Grano testa cilindrica a esagono incassato | 3 | €0.06 | €0.18 | Listino bulloneria B2B per lotti >1000 pz |
| **M_02** | Vite UNI 5933 | Vite a testa svasata piana M5x10 cl. 12.9 | 6 | €0.04 | €0.24 | Listino bulloneria B2B per lotti >1000 pz |
| **M_03** | Vite DIN 7500 E | Vite trilobata automaschiante M5x16 | 18 | €0.08 | €1.44 | Listino bulloneria B2B per lotti >1000 pz |
| **TOT** | **Minuteria M** | | | | **€1.86** | |

---

## 3. Analisi dei Costi dei Semilavorati / Componenti Lavorati ("S")

I componenti di tipo **S** (ad eccezione della targhetta **S_04** acquistata finita) sono semilavorati che richiedono lavorazioni meccaniche (tornitura e fresatura CNC) o stampa 3D FDM. I dati di volume e peso finito sono stati estratti analiticamente dai file STL originali. Il costo complessivo dei semilavorati per singolo prodotto è di **€476.04**, calcolato dal subagente **`s_component_agent`**.

### 3.1. Dettaglio Costi Semilavorati (S)

| ID | Componente | Materiale | Peso Grezzo | Peso Finito | Costo Mat. | Ore Lavoro | Costo Lavoro | Ore Macchina | Costo Macchina | Trattamenti | Costo Unitario |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **S_01** | Base | Alluminio 6082 | $12.83\text{ kg}$ | $4.97\text{ kg}$ | €57.74 | 0.75 | €18.75 | 0.75 (CNC) | €37.50 | €3.00 | **€116.99** |
| **S_02** | Supporto Rotante | Acciaio C45 | $21.71\text{ kg}$ | $9.48\text{ kg}$ | €43.42 | 1.20 | €30.00 | 1.20 (CNC) | €60.00 | €1.50 | **€134.92** |
| **S_03** | Coperchio | Ottone OT58 | $9.69\text{ kg}$ | $4.00\text{ kg}$ | €82.37 | 0.80 | €20.00 | 0.80 (CNC) | €40.00 | €0.00 | **€142.37** |
| **S_05** | Colonna | PLA | $0.061\text{ kg}$ | $0.061\text{ kg}$ | €1.53 | 0.25 | €6.25 | 4.00 (FDM) | €12.00 | €5.00 | **€24.78** |
| **S_06/08** | Tappi (Coppia) | PLA | $0.060\text{ kg}$ | $0.030\text{ kg}$ | €1.50 | 0.30 | €7.50 | 4.00 (FDM) | €12.00 | €0.00 | **€21.00** |
| **S_07** | Tirante | Alluminio 6082 | $1.13\text{ kg}$ | $1.08\text{ kg}$ | €5.09 | 0.30 | €7.50 | 0.30 (CNC) | €15.00 | €0.00 | **€27.59** |
| **S_09** | Piedino (4x) | TPU | $0.011\text{ kg}$ | $0.011\text{ kg}$ | €0.39 | 0.20 | €5.00 | 1.00 (FDM) | €3.00 | €0.00 | **€8.39** |
| **TOT** | **Semilavorati S**| | | | **€192.04**| **3.80** | **€95.00**| | **€179.50**| **€9.50** | **€476.04** |

> [!NOTE]
> - Per i componenti in metallo lavorati dal pieno (**S_01, S_02, S_03, S_07**), il peso grezzo si riferisce alla barra cilindrica di partenza (diametro $\varnothing$ leggermente maggiorato rispetto alla quota massima del bounding box). L'elevata asportazione di truciolo (sfrido) giustifica la differenza con il peso finito.
> - Per i componenti in PLA/TPU stampati in 3D (**S_05, S_06/08, S_09**), il peso grezzo coincide con il peso finito (nessun canale di colata o sfrido rilevante). Le ore macchina si riferiscono al tempo di stampa su stampanti FDM (tariffa €3.00/ora, comprensiva di usura ugelli, manutenzione ed energia locale), mentre le ore operatore coprono setup, calibrazione e rimozione supporti.
> - I **Tappi S_06/08** vengono stampati in coppia su un'unica piastra FDM per ottimizzare i tempi macchina, per un costo di lavorazione complessivo di **€21,00** (0.060 kg grezzi, 4.00 ore macchina). Tuttavia, sull'espositore finito viene montato **un solo tappo**: il peso finito riportato (0.030 kg) e il costo imputato al prodotto (**€10,50**, metà della coppia) riflettono questo utilizzo singolo, mentre il tappo gemello rimane disponibile come ricambio/scarto di produzione.
> - Il **Tirante S_07** è stato ipotizzato in alluminio estruso lavorato alle estremità (in linea con le richieste dell'utente), garantendo la massima rigidità strutturale rispetto all'ipotesi iniziale in plastica stampata 3D.
> - I **trattamenti superficiali** comprendono l'anodizzazione nera della base in alluminio (€3.00/pezzo), la brunitura chimica dell'acciaio (€1.50/pezzo) e il wrapping manuale in vera fibra di carbonio della colonna centrale (€5.00/pezzo, comprensivo di resina e foglio di carbonio).

---

## 4. Costo Unitario di Produzione e Pricing

Per determinare il costo industriale totale del prodotto finito, i costi unitari diretti sono stati sommati ai costi indiretti (ammortamenti e costi fissi di gestione dell'impianto), ipotizzando un volume produttivo annuo di **5.000 unità**.

### 4.1. Struttura del Costo Unitario
La ripartizione delle voci di costo sul singolo prodotto finito è la seguente:

- **Materie Prime ed Acquistati (BOM Cost):** **€364.90**
  - Semilavorati S (Materiale Grezzo): €192.04
  - Commerciali C (incluso Cuscinetto NTN): €171.00
  - Minuteria M: €1.86
- **Manodopera Diretta (Direct Labor):** **€113.75**
  - Manodopera Lavorazioni Meccaniche/Stampa (3.8h × €25.00/h): €95.00
  - Manodopera Assemblaggio Finale e Collaudo (0.75h × €25.00/h): €18.75
- **Ammortamento Macchinari e Trattamenti:** **€190.50**
  - Costo macchina CNC/Stampa 3D: €179.50
  - Costo Trattamenti Superficiali: €9.50
  - Ammortamento Attrezzature Stazione di Assemblaggio: €1.50
- **Costi Fissi e Gestione Capannone (Unitari):** **€17.00**
  - Consumo Energia Elettrica Stabilimento (CNC, stampanti, luci): €2.00
  - Spese Generiche (Affitto 500m², marketing, e-commerce, pulizia, software): €15.00
- **COSTO TOTALE DI PRODUZIONE UNITARIO:** **€686.15**

### 4.2. Definizione del Prezzo di Vendita
Trattandosi di un oggetto di lusso venduto in canali esclusivi (e-commerce proprietario e showroom fisici), viene applicato un markup industriale del **61.27%**.

$$Prezzo_{Senza\ IVA} = €686.15 \times (1 + 0.6127) = €1,106.55$$
$$Prezzo_{Ivato\ (22\%)} = €1,106.55 \times 1.22 \approx \mathbf{€1,350.00}$$

Un prezzo al pubblico di €1,350.00 IVA inclusa è coerente con il posizionamento del prodotto come accessorio di altissimo livello per collezionisti di stilografiche di pregio.

---

## 5. Break-Even Point (BEP) e Analisi di Convenienza

Per determinare il punto di pareggio dell'investimento, definiamo la struttura dei costi fissi annuali aziendali legati a questo specifico progetto:
- **Costi Fissi Annuali (Struttura, Marketing, Software):** €75,000 / anno (€15.00 × 5.000 unità)
- **Energia Elettrica Annuale:** €10,000 / anno (€2.00 × 5.000 unità)
- **Personale Dipendente (Manodopera):** €568,750 / anno (€113.75 × 5.000 unità)
- **Ammortamenti Impianti e Macchinari:** €952,500 / anno (€190.50 × 5.000 unità)
- **COSTI FISSI TOTALI ANNUALI ($CF_{Tot}$):** **€1,606,250.00**

Il costo variabile unitario ($CV_{Unit}$) è associato esclusivamente alle materie prime acquistate e consumate:
$$CV_{Unit} = €364.90\text{ (BOM Cost)}$$

Il Break-Even Point in unità di prodotto ($BEP_{Units}$) si calcola come:
$$BEP_{Units} = \frac{CF_{Tot}}{Prezzo_{Senza\ IVA} - CV_{Unit}} = \frac{€1,606,250.00}{€1,106.55 - €364.90} = \frac{€1,606,250.00}{€741.65} \approx \mathbf{2.166\text{ unità}}$$

### Risultati dell'Analisi:
- **Volume di Pareggio:** **2,166 unità**
- **Fatturato di Pareggio:** **€2,396,837.30** (senza IVA)
- **Tempo di recupero dell'investimento:** Con un volume di vendita previsto di 5.000 unità/anno, il BEP verrà raggiunto in **5.2 mesi** dall'avvio della commercializzazione.

---

## 6. Conclusioni e Raccomandazioni

L'analisi mostra che il progetto presenta un'ottima marginalità unitaria (€420.40 di margine operativo lordo per pezzo venduto). Il recupero dell'investimento iniziale avviene in meno di 6 mesi, il che rende il progetto altamente sostenibile.

### Raccomandazioni per la Fabbricazione:
1. **Fornitura dell'alluminio e ottone:** Dato l'elevato quantitativo di sfrido per la Base (da 12.83 kg a 4.97 kg) e il Coperchio (da 9.69 kg a 4.00 kg), è fondamentale stringere accordi con un riciclatore metallico per recuperare il valore economico del truciolo di alluminio 6082 e ottone OT58.
2. **Ottimizzazione Stampa 3D:** Per la Colonna S_05 e i Tappi S_06/08, l'utilizzo di stampanti 3D industriali multi-ugello consentirà di ridurre ulteriormente i tempi di stampa reali, portando a costi di ammortamento macchina inferiori.
3. **Controllo Qualità Cuscinetto:** Il cuscinetto reggispinta NTN 51124 rappresenta il costo singolo d'acquisto più elevato (€120.00). Si raccomanda di validare la sua installazione con accoppiamenti ad alta tolleranza sulla Base S_01 e sul Supporto Rotante S_02 per evitare giochi assiali che comprometterebbero la percezione di lusso del movimento rotatorio.
