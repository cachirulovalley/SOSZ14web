var type = navigator.appName,
    lang;
if (type === "Microsoft Internet Explorer"){
    lang = navigator.userLanguage;
}
else{
    lang = navigator.language;
}

var prefix = lang.substring(0,2);


if (prefix == "ko") {
  window.location.replace('http://www.plasticscm.com/partners/architectgroup.html');
}

/*
National code information (2Character)
af Afrikaans
ar-ae Arabic (U.A.E.)
ar-bh Arabic (Bahrain)
ar-dz Arabic (Algeria)
ar-eg Arabic (Egypt)
ar-iq Arabic (Iraq)
ar-jo Arabic (Jordan)
ar-kw Arabic (Kuwait)
ar-lb Arabic (Lebanon)
ar-ly Arabic (Libya)
ar-ma Arabic (Morocco)
ar-om Arabic (Oman)
ar-qa Arabic (Qatar)
ar-sa Arabic (Saudi Arabia)
ar-sy Arabic (Syria)
ar-tn Arabic (Tunisia)
ar-ye Arabic (Yemen)
be Belarusian
bg Bulgarian
ca Catalan
cs Czech
da Danish
de German (Standard)
de-at German (Austria)
de-ch German (Switzerland)
de-li German (Liechtenstein)
de-lu German (Luxembourg)
el Greek
en English
en English (Caribbean)
en-au English (Australia)
en-bz English (Belize)
en-ca English (Canada)
en-gb English (Great Britain)
en-ie English (Ireland)
en-jm English (Jamaica)
en-nz English (New Zealand)
en-tt English (Trinidad)
en-us English (United States)
en-za English (South Africa)
es Spanish (Spain Modern)
es Spanish (Spain Traditional)
es-ar Spanish (Argentina)
es-bo Spanish (Bolivia)
es-cl Spanish (Chile)
es-co Spanish (Colombia)
es-cr Spanish (Costa Rica)
es-do Spanish (Dominican Republic)
es-ec Spanish (Ecuador)
es-gt Spanish (Guatemala)
es-hn Spanish (Honduras)
es-mx Spanish (Mexico)
es-ni Spanish (Nicaragua)
es-pa Spanish (Panama)
es-pe Spanish (Peru)
es-pr Spanish (Puerto Rico)
es-py Spanish (Paraguay)
es-sv Spanish (El Salvador)
es-uy Spanish (Uruguay)
es-ve Spanish (Venezuela)
et Estonian
eu Basque
fa Farsi
fi Finnish
fo Faeroese
fr French (Standard)
fr-be French (Belgium)
fr-ca French (Canada)
fr-ch French (Switzerland)
fr-lu French (Luxembourg)
gd Gaelic (Scotland)
gd-ie Gaelic (Ireland)
he Hebrew
hi Hindi
hr Croatian
hu Hungarian
in Indonesian
is Icelandic
it Italian (Standard)
it-ch Italian (Switzerland)
ja Japanese
ji Yiddish
ko Korean
ko Korean (Johab)
lt Lithuanian
lv Latvian
mk Macedonian
ms Malaysian
mt Maltese
nl Dutch (Standard)
nl-be Dutch (Belgium)
no Norwegian (Bokmal)
no Norwegian (Nynorsk)
pl Polish
pt Portuguese (Standard)
pt-br Portuguese (Brazil)
rm Rhaeto-Romanic
ro Romanian
ro-mo Romanian (Moldavia)
ru Russian
ru-mo Russian (Moldavia)
sb Sorbian
sk Slovak
sl Slovenian
sq Albanian
sr Serbian (Cyrillic)
sr Serbian (Latin)
sv Swedish
sv-fi Swedish (Finland)
sx Sutu
sz Sami (Lappish)
th Thai
tn Tswana
tr Turkish
ts Tsonga
uk Ukrainian
ur Urdu
ve Venda
vi Vietnamese
xh Xhosa
zh-cn Chinese (PRC)
zh-hk Chinese (Hong Kong, S.A.R. China)
zh-sg Chinese (Singapore)
zh-tw Chinese (Taiwan)
zu Zulu
*/
