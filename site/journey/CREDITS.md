# Journey photographs and map data

These files belong to the home page journey ("Places of the Prophet and the Imams"). They are **decorative illustrations**: the catalog itself never copies other sites' pages. Check the permissions below before the site goes public.

## Photographs

| File | Subject | Credit | Terms |
|---|---|---|---|
| `img/hero.jpg` | Shrine courtyard at dusk (home page background) | Supplied by the project owner. **Credit and permission to be confirmed.** | Unknown |
| `img/mecca.jpg` | Masjid al-Haram and the Kaaba | Al-Kafeel photo archive, https://pic.alkafeel.net (section "Makkah"), photographer not named | **Permission not yet confirmed** |
| `img/medina.jpg` | The Prophet's Mosque | Samer al-Husseini (سامر الحسيني), Al-Kafeel photo archive | **Permission not yet confirmed** |
| `img/najaf.jpg` | Shrine of Imam Ali | As'ad Zuwayn (اسعد زوين), Al-Kafeel photo archive | **Permission not yet confirmed** |
| `img/karbala.jpg` | Shrine of Imam Husayn | Samer al-Husseini (سامر الحسيني), Al-Kafeel photo archive | **Permission not yet confirmed** |
| `img/kadhimiya.jpg` | Kadhimiya shrine, Baghdad | Ali Ward al-Ghaban (علي ورد الغبان), Al-Kafeel photo archive | **Permission not yet confirmed** |
| `img/mashhad.jpg` | Shrine of Imam al-Ridha | Al-Kafeel photo archive, photographer not named | **Permission not yet confirmed** |
| `img/qom.jpg` | Shrine of Fatima Masumah | Al-Kafeel photo archive, photographer not named | **Permission not yet confirmed** |
| `img/samarra.jpg` | Al-Askari Shrine | Akram al-Fayhan (أكرم الفيحان), Al-Kafeel photo archive | **Permission not yet confirmed** |
| `img/toronto.jpg` | Toronto skyline from Snake Island | Jchmrt, "Sunset Toronto Skyline Panorama Crop from Snake Island", Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg | CC BY-SA 4.0. The file here is a crop and resize of the original. Credit and licence link are shown on the page. |

**The eight Al-Kafeel photographs (every file above except `hero.jpg` and `toronto.jpg`) are deliberately not committed to this repository, because it is public and permission is not confirmed.** They are listed in a local `.git/info/exclude`. Until they are added, those stops show no picture on a deployed copy. To add them, get permission, put the files in `site/journey/img/` under the names above, and remove the lines from `.git/info/exclude`.

The Al-Kafeel archive (https://pic.alkafeel.net) has no robots.txt and no usage terms that we could find. Its pages offer photographs for download, but that is not a licence. Before the site is published, ask the Al-Kafeel network for written permission to use these eight photographs (or replace them). Until then, keep this site private.

## Map data

- `geo.json` is built from Natural Earth country outlines, `countries-50m` and `countries-110m` from the `world-atlas` package, and `ne_50m_lakes`. Natural Earth is in the public domain. Outlines are simplified and projected for drawing; nothing in the file is a legal border.
