function navodila(){
	Swal.fire({
        title: 'NAVODILA IGRE',
        html: '<b>PREMIKANJE:</b> Uporabi tipki <b>A</b> (levo) in <b>D</b> (desno) za premikanje svoje ploščice.<br><br>' +
              '<b>ODBIJANJE:</b> Pritisni <b>PRESLEDEK</b>, ko se žogica približa tvoji ploščici, da jo odbiješ nazaj nasprotniku.<br><br>' +
              '<b>ZMAGA:</b> Igra uporablja teniško točkovanje (15, 30, 40, IGRA). Zmaga tisti, ki prvi doseže zadnjo stopnjo!<br><br>' +
              'Pazi na odštevanje in srečno!',
        icon: 'info',
        confirmButtonText: 'Igraj',
        confirmButtonColor: '#28a745',
        allowOutsideClick: false
    });
}