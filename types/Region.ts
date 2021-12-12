
export enum Region {
  Abruzzo = 'Abruzzo',
  Basilicata = 'Basilicata',
  Calabria = 'Calabria',
  Campania = 'Campania',
  EmiliaRomagna = 'Emilia Romagna',
  FriuliVeneziaGiulia = 'Friuli Venezia Giulia',
  Lazio = 'Lazio',
  Liguria = 'Liguria',
  Lombardia = 'Lombardia',
  Marche = 'Marche',
  Molise = 'Molise',
  Piemonte = 'Piemonte',
  Puglia = 'Puglia',
  Sardegna = 'Sardegna',
  Sicilia = 'Sicilia',
  Toscana = 'Toscana',
  TrentinoAltoAdige = 'Trentino Alto Adige',
  Umbria = 'Umbria',
  ValledAosta = "Valle d'Aosta",
  Veneto = 'Veneto'
}

export const ItalianRegionsMap = Object.freeze(
  new Map<Region, string>()
    .set(Region.Abruzzo, '^Abruzzo')
    .set(Region.Basilicata, '^Basilicata')
    .set(Region.Calabria, '^Calabria')
    .set(Region.Campania, '^Campania')
    .set(Region.EmiliaRomagna, '^Emilia.*Romagna')
    .set(Region.FriuliVeneziaGiulia, '^Friuli$|.*Venezia.*Giulia')
    .set(Region.Lazio, '^Lazio')
    .set(Region.Liguria, '^Liguria')
    .set(Region.Lombardia, '^Lombardia')
    .set(Region.Marche, '^Marche')
    .set(Region.Molise, '^Molise')
    .set(Region.Piemonte, '^Piemonte')
    .set(Region.Puglia, '^Puglia')
    .set(Region.Sardegna, '^Sardegna')
    .set(Region.Sicilia, '^Sicilia')
    .set(Region.Toscana, '^Toscana')
    .set(Region.TrentinoAltoAdige, '^Trentino.*(Alto.*Adige)?')
    .set(Region.Umbria, '^Umbria')
    .set(Region.ValledAosta, '^Val(le)?.*Aosta')
    .set(Region.Veneto, '^Veneto')
)
