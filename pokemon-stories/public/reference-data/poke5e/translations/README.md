# Hungarian Poke5e translations

`hu.json` contains only localized fields that override the English Poke5e snapshot. Each record must use this shape:

```json
{
  "dataset": "pokemon",
  "recordId": "bulbasaur",
  "payload": {
    "name": "...",
    "description": "...",
    "types": ["..."]
  }
}
```

Supported datasets are `pokemon`, `moves`, `abilities`, `items`, and `tms`. Keep the `recordId` equal to the source record id. The migration uploads these records to `poke5e_reference_translations`; values omitted from `payload` fall back to the English source.