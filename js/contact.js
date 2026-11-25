// Validarea formularului de contact (fara server: mesajul de confirmare este afisat local)
document.addEventListener('DOMContentLoaded', function () {
    var formular = document.getElementById('formular-contact');
    if (!formular) {
        return;
    }

    var mesajGeneral = document.getElementById('mesaj-formular');
    var reguli = {
        nume: {
            verifica: function (valoare) { return valoare.trim().length >= 3; },
            mesaj: 'Introduceți numele complet (minimum 3 caractere).'
        },
        email: {
            verifica: function (valoare) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(valoare.trim()); },
            mesaj: 'Introduceți o adresă de e-mail validă (exemplu: nume@domeniu.md).'
        },
        telefon: {
            verifica: function (valoare) { return valoare.trim() === '' || /^[0-9+()\s-]{6,20}$/.test(valoare.trim()); },
            mesaj: 'Numărul de telefon poate conține doar cifre, spații, paranteze și semnul +.'
        },
        mesaj: {
            verifica: function (valoare) { return valoare.trim().length >= 10; },
            mesaj: 'Descrieți problema în minimum 10 caractere.'
        }
    };

    function seteazaEroare(camp, text) {
        var span = document.getElementById('eroare-' + camp.id);
        if (span) {
            span.textContent = text;
        }
        if (text) {
            camp.setAttribute('aria-invalid', 'true');
            camp.setAttribute('aria-describedby', 'eroare-' + camp.id);
        } else {
            camp.removeAttribute('aria-invalid');
            camp.removeAttribute('aria-describedby');
        }
    }

    function afiseazaMesaj(text, tip) {
        mesajGeneral.textContent = text;
        mesajGeneral.className = 'mesaj-formular ' + tip;
        mesajGeneral.hidden = false;
    }

    formular.addEventListener('submit', function (event) {
        event.preventDefault();
        var primulInvalid = null;

        Object.keys(reguli).forEach(function (id) {
            var camp = document.getElementById(id);
            var regula = reguli[id];
            var valid = regula.verifica(camp.value);
            seteazaEroare(camp, valid ? '' : regula.mesaj);
            if (!valid && !primulInvalid) {
                primulInvalid = camp;
            }
        });

        if (primulInvalid) {
            afiseazaMesaj('Formularul conține câmpuri completate incorect. Verificați mesajele de sub câmpuri.', 'eroare-globala');
            primulInvalid.focus();
            return;
        }

        afiseazaMesaj('Solicitarea a fost înregistrată. Vă vom contacta în timpul programului de lucru.', 'succes');
        formular.reset();
        Object.keys(reguli).forEach(function (id) {
            seteazaEroare(document.getElementById(id), '');
        });
    });

    // Mesajele de eroare dispar imediat ce utilizatorul corectează câmpul
    Object.keys(reguli).forEach(function (id) {
        var camp = document.getElementById(id);
        camp.addEventListener('input', function () {
            if (reguli[id].verifica(camp.value)) {
                seteazaEroare(camp, '');
            }
        });
    });
});
