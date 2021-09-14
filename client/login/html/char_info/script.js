function zatwierdz() {
    var char_firstname = document.getElementById("char_firstname").value;
    var char_lastname = document.getElementById("char_lastname").value;
    var char_birthdate = document.getElementById("char_birthdate").value;
    var char_height = document.getElementById("char_height").value;
    var char_weight = document.getElementById("char_weight").value;
    var char_sex
    var hair = $("#fryzura_slider").val();
    var hairColor = $('input[name=wlosy_kolor_radio]:checked').val();
    var rumience = $("#rumience_slider").val();
    var rumienceOpacity = $("#intensivity_rumience_slider").val();
    var rumienceColor = $('input[name=rumience_color_radio]:checked').val();
    var skazy = $("#skazy_slider").val();
    var skazyIntenstywnosc = $("#skazy_slider_intenstynosc").val();
    var zmarszczki = $("#zmarszczki_slider").val();
    var zmarszczkiIntenstywnosc = $("#intenstywnosc_zmarszczek_slider").val();
    var piegi = $("#piegi_slider").val();
    var piegiIntenstywnosc = $("#intensivity_piegi_slider").val();
    var makijaz = $("#makeup_slider").val();
    var makijazIntenstywnosc = $("#intensivity_makeup_slider").val();
    var szminka = $("#szminka_slider").val();
    var szminkaIntenstywnosc = $("#intensivity_szminka_slider").val();
    var szminkaColor = $('input[name=makijaz_color_radio]:checked').val();
    var brwi = $("#brwi_slider").val();
    var brwiGrubosc = $("#brwi_grubosc_slider").val();
    var brwiColor = $('input[name=brwi_kolor_radio]:checked').val();
    var broda = $("#broda_slider").val();
    var brodaGestosc = $("#broda_gestosc_slider").val();
    var brodaColor = $('input[name=broda_kolor_radio]:checked').val();
    var postarzenie = $("#postarzenie_slider").val();
    var postarzenieIntensywnosc = $("#intensivity_postarzenie_slider").val();
    var dadFace = $('input[name=ojciec]:checked').val();
    var momFace = $('input[name=matka]:checked').val();
    var podobienstwo = $("#podobienstwo_slider").val();     // $("#").val()
    var eyeColor = $('input[name=color]:checked').val();
    var kolorSkory = $('input[name=skin_color_radio]:checked').val();

    var radios = document.getElementsByName('gender');

    var radioChecked

    for (var i = 0, lenght = radios.length; i < lenght; i++) {
        if (radios[i].checked) {
            char_sex = radios[i].value;
            radioChecked = true
            //alert(radios[i].value);
            break;
        }
    }

    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var dzisiaj = yyyy + "-" + mm + "-" + dd;

    var blednaData

    // 2019-08-06

    if (char_birthdate === dzisiaj) {
        blednaData = true;
    }


    if (char_firstname !== "" && char_lastname !== "" && char_birthdate !== "" && char_height !== "" && char_weight !== "" && radioChecked === true && blednaData !== true) {
        //alert(`${char_firstname} ${char_lastname} ${char_sex} ${char_birthdate} ${char_height} ${char_weight}`);
        let stringify = {dadFace: dadFace,
                         momFace: momFace,
                         podobienstwo: podobienstwo,
                         eyeColor: eyeColor,
                         kolorSkory: kolorSkory,
                         hair: hair,
                         hairColor: hairColor,
                         rumience: rumience,
                         rumienceOpacity: rumienceOpacity,
                         rumienceColor: rumienceColor,
                         skazy: skazy,
                         skazyIntenstywnosc: skazyIntenstywnosc,
                         zmarszczki: zmarszczki,
                         zmarszczkiIntenstywnosc: zmarszczkiIntenstywnosc,
                         piegi: piegi,
                         piegiIntenstywnosc: piegiIntenstywnosc,
                         makijaz: makijaz,
                         makijazIntenstywnosc: makijazIntenstywnosc,
                         szminka: szminka,
                         szminkaIntenstywnosc: szminkaIntenstywnosc,
                         szminkaColor: szminkaColor,
                         brwi: brwi,
                         brwiGrubosc: brwiGrubosc,
                         brwiColor: brwiColor,
                         broda: broda,
                         brodaGestosc: brodaGestosc,
                         brodaColor: brodaColor,
                         postarzenie: postarzenie,
                         postarzenieIntensywnosc: postarzenieIntensywnosc
                        };

        let object = JSON.stringify(stringify);

        alt.emit("register_player_character", char_firstname, char_lastname, char_birthdate, char_height, char_weight, char_sex, object);
        
    } else if (char_birthdate === dzisiaj) {
        new Noty({
            theme: "mint",
            type: 'error',
            conatainer: ".error_layout",
            layout: 'topRight',
            text: 'Błędna data urodzenia',
            progressBar: true,
            timeout: 3000,
        }).show();
    } else {
        new Noty({
            theme: "mint",
            type: 'error',
            conatainer: ".error_layout",
            layout: 'topRight',
            text: 'Nie wypełniono wszystkich pól',
            progressBar: true,
            timeout: 3000,
        }).show();
    }
}

$(document).ready(function(){
    var height_1 = $(window).height();
    var height_2 = $("#char_info_dialog").height();
    var newHeight = height_1 - height_2;

    var width_1 = $(window).width();
    var width_2 = $("#char_info_dialog").width()
    var newWidth = width_1 - width_2

    
    $("#char_style").css("width", newWidth - 5);
    $("#char_style").css("height", newHeight + 17);
})

$(document).ready(function(){
    var height_1 = $(window).height();
    var height_2 = $("#char_style").height();
    var newHeight = height_1 - height_2;

    var width_1 = $(window).width();
    var width_2 = $("#char_info_dialog").width();
    var newWidth = width_1 - width_2

    
    $("#char_style_tabs").css("width", newWidth - 5);
    $("#char_style_tabs").css("height", newHeight);
})


$(document).ready(function(){
    $("#arrow-left").click(function() {
        let val = $("#podobienstwo_slider").val();
        document.getElementById("podobienstwo_slider").value = val - 1;
        //$("#podobienstwo_slider").val(val - 1);
    });

    $("#arrow-right").click(function() {
        let val = $("#podobienstwo_slider").val();
        document.getElementById("podobienstwo_slider").value++;
        //$("#podobienstwo_slider").val(val + 1);
    });

    //
    $("#arrow-left_rumience").click(function() {
        let val = $("#rumience_slider").val();
        document.getElementById("rumience_slider").value = val - 1;
        //$("#podobienstwo_slider").val(val - 1);
    });

    $("#arrow-right_rumience").click(function() {
        let val = $("#rumience_slider").val();
        document.getElementById("rumience_slider").value++;
        //$("#podobienstwo_slider").val(val + 1);
    });

    //
    $("#arrow-left_tradzik").click(function() {
        let val = $("#tradzik_slider").val();
        document.getElementById("tradzik_slider").value = val - 1;
        //$("#podobienstwo_slider").val(val - 1);
    });

    $("#arrow-right_tradzik").click(function() {
        let val = $("#tradzik_slider").val();
        document.getElementById("tradzik_slider").value++;
        //$("#podobienstwo_slider").val(val + 1);
    });


    $("#arrow-left_skazy").click(function() {
        let val = $("#skazy_slider").val();
        document.getElementById("skazy_slider").value = val - 1;
        //$("#podobienstwo_slider").val(val - 1);
    });

    $("#arrow-right_skazy").click(function() {
        let val = $("#skazy_slider").val();
        document.getElementById("skazy_slider").value++;
        //$("#podobienstwo_slider").val(val + 1);
    });


    $("#arrow-left_skazy_intenstynosc").click(function() {
        let val = $("#skazy_slider_intenstynosc").val();
        document.getElementById("skazy_slider_intenstynosc").value = val - 1;
        //$("#podobienstwo_slider").val(val - 1);
    });

    $("#arrow-right_skazy_intenstynosc").click(function() {
        let val = $("#skazy_slider_intenstynosc").val();
        document.getElementById("skazy_slider_intenstynosc").value++;
        //$("#podobienstwo_slider").val(val + 1);
    });



    $("#arrow-left_piegi").click(function() {
        let val = $("#piegi_slider").val();
        document.getElementById("piegi_slider").value = val - 1;
        //$("#podobienstwo_slider").val(val - 1);
    });

    $("#arrow-right_piegi").click(function() {
        let val = $("#piegi_slider").val();
        document.getElementById("piegi_slider").value++;
        //$("#podobienstwo_slider").val(val + 1);
    });

    $("#arrow-left_zmarszczki").click(function() {
        let val = $("#zmarszczki_slider").val();
        document.getElementById("zmarszczki_slider").value = val - 1;
        //$("#zmarszczki_slider").val(val - 1);
    });

    $("#arrow-right_zmarszczki").click(function() {
        let val = $("#zmarszczki_slider").val();
        document.getElementById("zmarszczki_slider").value++;
        //$("#zmarszczki_slider").val(val + 1);
    });


    $("#arrow-left_intenstywnosc_zmarszczek").click(function() {
        let val = $("#intenstywnosc_zmarszczek_slider").val();
        document.getElementById("intenstywnosc_zmarszczek_slider").value = val - 1;
        //$("#intenstywnosc_zmarszczek_slider").val(val - 1);
    });

    $("#arrow-right_intenstywnosc_zmarszczek").click(function() {
        let val = $("#intenstywnosc_zmarszczek_slider").val();
        document.getElementById("intenstywnosc_zmarszczek_slider").value++;
        //$("#intenstywnosc_zmarszczek_slider").val(val + 1);
    });


    $("#arrow-left_fryzura").click(function() {
        let val = $("#fryzura_slider").val();
        document.getElementById("fryzura_slider").value = val - 1;
        //$("#fryzura_slider").val(val - 1);
    });

    $("#arrow-right_fryzura").click(function() {
        let val = $("#fryzura_slider").val();
        document.getElementById("fryzura_slider").value++;
        //$("#fryzura_slider").val(val + 1);
    });


    $("#arrow-left_brwi").click(function() {
        let val = $("#brwi_slider").val();
        document.getElementById("brwi_slider").value = val - 1;
        //$("#fryzura_slider").val(val - 1);
    });

    $("#arrow-right_brwi").click(function() {
        let val = $("#brwi_slider").val();
        document.getElementById("brwi_slider").value++;
        //$("#fryzura_slider").val(val + 1);
    });


    $("#arrow-left_grubosc_brwi").click(function() {
        let val = $("#brwi_grubosc_slider").val();
        document.getElementById("brwi_grubosc_slider").value = val - 1;
        //$("#fryzura_slider").val(val - 1);
    });

    $("#arrow-right_grubosc_brwi").click(function() {
        let val = $("#brwi_grubosc_slider").val();
        document.getElementById("brwi_grubosc_slider").value++;
        //$("#fryzura_slider").val(val + 1);
    });


    $("#arrow-left_broda").click(function() {
        let val = $("#broda_slider").val();
        document.getElementById("broda_slider").value = val - 1;
        //$("#broda_slider").val(val - 1);
    });

    $("#arrow-right_broda").click(function() {
        let val = $("#broda_slider").val();
        document.getElementById("broda_slider").value++;
        //$("#broda_slider").val(val + 1);
    });


    $("#arrow-left_gestosc_brody").click(function() {
        let val = $("#broda_gestosc_slider").val();
        document.getElementById("broda_gestosc_slider").value = val - 1;
        //$("#broda_gestosc_slider").val(val - 1);
    });

    $("#arrow-right_gestosc_brody").click(function() {
        let val = $("#broda_gestosc_slider").val();
        document.getElementById("broda_gestosc_slider").value++;
        //$("#broda_gestosc_slider").val(val + 1);
    });


    $("#arrow-left_tops").click(function() {
        let val = $("#tops_slider").val();
        document.getElementById("tops_slider").value = val - 1;
        //$("#tops_slider").val(val - 1);
    });

    $("#arrow-right_tops").click(function() {
        let val = $("#tops_slider").val();
        document.getElementById("tops_slider").value++;
        //$("#tops_slider").val(val + 1);
    });


    $("#arrow-left_tshirt").click(function() {
        let val = $("#tshirt_slider").val();
        document.getElementById("tshirt_slider").value = val - 1;
        //$("#tshirt_slider").val(val - 1);
    });

    $("#arrow-right_tshirt").click(function() {
        let val = $("#tshirt_slider").val();
        document.getElementById("tshirt_slider").value++;
        //$("#tshirt_slider").val(val + 1);
    });


    $("#arrow-left_ramiona").click(function() {
        let val = $("#ramiona_slider").val();
        document.getElementById("ramiona_slider").value = val - 1;
        //$("#ramiona_slider").val(val - 1);
    });

    $("#arrow-right_ramiona").click(function() {
        let val = $("#ramiona_slider").val();
        document.getElementById("ramiona_slider").value++;
        //$("#ramiona_slider").val(val + 1);
    });


    $("#arrow-left_spodnie").click(function() {
        let val = $("#spodnie_slider").val();
        document.getElementById("spodnie_slider").value = val - 1;
        //$("#spodnie_slider").val(val - 1);
    });

    $("#arrow-right_spodnie").click(function() {
        let val = $("#spodnie_slider").val();
        document.getElementById("spodnie_slider").value++;
        //$("#spodnie_slider").val(val + 1);
    });


    $("#arrow-left_buty").click(function() {
        let val = $("#buty_slider").val();
        document.getElementById("buty_slider").value = val - 1;
        //$("#buty_slider").val(val - 1);
    });

    $("#arrow-right_buty").click(function() {
        let val = $("#buty_slider").val();
        document.getElementById("buty_slider").value++;
        //$("#buty_slider").val(val + 1);
    });


    $("#arrow-left_glowa").click(function() {
        let val = $("#glowa_slider").val();
        document.getElementById("glowa_slider").value = val - 1;
        //$("#glowa_slider").val(val - 1);
    });

    $("#arrow-right_glowa").click(function() {
        let val = $("#glowa_slider").val();
        document.getElementById("glowa_slider").value++;
        //$("#glowa_slider").val(val + 1);
    });


    $("#arrow-left_okulary").click(function() {
        let val = $("#okulary_slider").val();
        document.getElementById("okulary_slider").value = val - 1;
        //$("#okulary_slider").val(val - 1);
    });

    $("#arrow-right_okulary").click(function() {
        let val = $("#okulary_slider").val();
        document.getElementById("okulary_slider").value++;
        //$("#okulary_slider").val(val + 1);
    });


    $("#arrow-left_uszy").click(function() {
        let val = $("#uszy_slider").val();
        document.getElementById("uszy_slider").value = val - 1;
        //$("#uszy_slider").val(val - 1);
    });

    $("#arrow-right_uszy").click(function() {
        let val = $("#uszy_slider").val();
        document.getElementById("uszy_slider").value++;
        //$("#uszy_slider").val(val + 1);
    });


    $("#arrow-left_akcesoria").click(function() {
        let val = $("#akcesoria_slider").val();
        document.getElementById("akcesoria_slider").value = val - 1;
        //$("#akcesoria_slider").val(val - 1);
    });

    $("#arrow-right_akcesoria").click(function() {
        let val = $("#akcesoria_slider").val();
        document.getElementById("akcesoria_slider").value++;
        //$("#akcesoria_slider").val(val + 1);
    });


    $("#arrow-left_oznaczenia").click(function() {
        let val = $("#oznaczenia_slider").val();
        document.getElementById("oznaczenia_slider").value = val - 1;
        //$("#oznaczenia_slider").val(val - 1);
    });

    $("#arrow-right_oznaczenia").click(function() {
        let val = $("#oznaczenia_slider").val();
        document.getElementById("oznaczenia_slider").value++;
        //$("#oznaczenia_slider").val(val + 1);
    });


    $("#arrow-left_kamizelki").click(function() {
        let val = $("#kamizelki_slider").val();
        document.getElementById("kamizelki_slider").value = val - 1;
        //$("#kamizelki_slider").val(val - 1);
    });

    $("#arrow-right_kamizelki").click(function() {
        let val = $("#kamizelki_slider").val();
        document.getElementById("kamizelki_slider").value++;
        //$("#kamizelki_slider").val(val + 1);
    });


    $("#arrow-left_torby").click(function() {
        let val = $("#torby_slider").val();
        document.getElementById("torby_slider").value = val - 1;
        //$("#torby_slider").val(val - 1);
    });

    $("#arrow-right_torby").click(function() {
        let val = $("#torby_slider").val();
        document.getElementById("torby_slider").value++;
        //$("#torby_slider").val(val + 1);
    });


    $("#arrow-left_postarzenie").click(function() {
        let val = $("#postarzenie_slider").val();
        document.getElementById("postarzenie_slider").value = val - 1;
    });

    $("#arrow-right_postarzenie").click(function() {
        let val = $("#postarzenie_slider").val();
        document.getElementById("postarzenie_slider").value++;
    });


    $("#arrow-left_intensivity_postarzenie").click(function() {
        let val = $("#intensivity_postarzenie_slider").val();
        document.getElementById("intensivity_postarzenie_slider").value = val - 1;
    });

    $("#arrow-right_intensivity_postarzenie").click(function() {
        let val = $("#intensivity_postarzenie_slider").val();
        document.getElementById("intensivity_postarzenie_slider").value++;
    });
});


if ("alt" in window) {
    alt.on("insertMakeupColor", (colorID ,red, green, blue) => {
        $( "#makeupColors" ).append( 
        `<div>
            <input type="radio" id="makijaz_kolor-${colorID}" name="makijaz_color_radio" value="${colorID}">
            <label for="makijaz_kolor-${colorID}">
            <span style="background-color: rgb(${red}, ${green}, ${blue}); display: flex; justify-content: center; align-items: center; width: 30; height: 30; margin: 4px 4px 0 0;">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" />
            </span>
            </label>
        </div>` );      
    });

    alt.on("insertHairColor", (colorID ,red, green, blue) => {
        $( "#kolor_wlosow_radio_div" ).append( 
        `<div>
            <input type="radio" id="wlosy_kolor_${colorID}" name="makijaz_color_radio" value="${colorID}">
            <label for="wlosy_kolor_${colorID}">
            <span style="background-color: rgb(${red}, ${green}, ${blue}); display: flex; justify-content: center; align-items: center; width: 30; height: 30; margin: 4px 4px 0 0;">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" />
            </span>
            </label>
        </div>` );      
    });

    alt.on("reload", ()=>{
        location.reload();
    });

    alt.on("setMaxComponetVariarions", (maxValues) => {
        let Values = JSON.parse(maxValues);
        document.getElementById("tops_slider").max = Values.maxTops;
        document.getElementById("tshirt_slider").max = Values.maxUndershirts;
        document.getElementById("ramiona_slider").max = Values.maxTorso;
        document.getElementById("spodnie_slider").max = Values.maxLegs;
        document.getElementById("buty_slider").max = Values.maxShoes;
        document.getElementById("glowa_slider").max = Values.maxHats;
        document.getElementById("okulary_slider").max = Values.maxGlasses;
        document.getElementById("uszy_slider").max = Values.maxEars;
        document.getElementById("akcesoria_slider").max = Values.maxAccesories;
        document.getElementById("oznaczenia_slider").max = Values.maxDecals
        document.getElementById("kamizelki_slider").max = Values.maxArmors;
        document.getElementById("torby_slider").max = Values.maxBags;
        document.getElementById("fryzura_slider").max = Values.maxHairs;
    });

    alt.on("setMaxNumberOfPedTextureVariations", (componetID, drawableID, maxComponentTextures) => {
        if (componetID === 11) {
            document.getElementById("tops_variations_slider").max = maxComponentTextures;
            $("#tops_variations_slider").val(0)
            $("#tops_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 8) {
            document.getElementById("tshirt_variations_slider").max = maxComponentTextures;
            $("#tshirt_variations_slider").val(0)
            $("#tshirt_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 3) {
            document.getElementById("ramiona_variations_slider").max = maxComponentTextures;
            $("#ramiona_variations_slider").val(0)
            $("#ramiona_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 4) {
            document.getElementById("spodnie_variations_slider").max = maxComponentTextures;
            $("#spodnie_variations_slider").val(0)
            $("#spodnie_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 6) {
            document.getElementById("buty_variations_slider").max = maxComponentTextures;
            $("#buty_variations_slider").val(0)
            $("#buty_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 7) {
            document.getElementById("akcesoria_variations_slider").max = maxComponentTextures;
            $("#akcesoria_variations_slider").val(0)
            $("#akcesoria_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 10) {
            document.getElementById("oznaczenia_variations_slider").max = maxComponentTextures;
            $("#oznaczenia_variations_slider").val(0)
            $("#oznaczenia_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 9) {
            document.getElementById("kamizelki_variations_slider").max = maxComponentTextures;
            $("#kamizelki_variations_slider").val(0)
            $("#kamizelki_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 5) {
            document.getElementById("torby_variations_slider").max = maxComponentTextures;
            $("#torby_variations_slider").val(0)
            $("#torby_variations_value").text(`0 / ${maxComponentTextures}`);
        }
    });

    alt.on("setMaxNumberOfPedPropTextureVariations", (componetID, drawableID, maxComponentTextures) => {
        if (componetID === 0) {
            document.getElementById("glowa_variations_slider").max = maxComponentTextures;
            $("#glowa_variations_slider").val(0)
            $("#glowa_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 1) {
            document.getElementById("okulary_variations_slider").max = maxComponentTextures;
            $("#okulary_variations_slider").val(0)
            $("#okulary_variations_value").text(`0 / ${maxComponentTextures}`);
        } else if (componetID === 2) {
            document.getElementById("uszy_variations_slider").max = maxComponentTextures;
            $("#uszy_variations_slider").val(0)
            $("#uszy_variations_value").text(`0 / ${maxComponentTextures}`);
        }
    });
}




$(document).ready(function(){
    $("#tab_wlosy_zarost").hide();
    $("#tab_ubior").hide();
    $("#wyglad").css("background-color", "cornflowerblue");

    $("#wlosy_zarost").click(function(){
        $("#wyglad").css("background-color", "transparent");
        $("#ubior").css("background-color", "transparent");
        $("#tab_wyglad").hide();
        $("#tab_ubior").hide();
        $("#tab_wlosy_zarost").show();
        $("#wlosy_zarost").css("background-color", "cornflowerblue");
        alt.emit("changeCameraTwarz");
    });

    $("#wyglad").click(function(){
        $("#wlosy_zarost").css("background-color", "transparent");
        $("#ubior").css("background-color", "transparent");
        $("#tab_wlosy_zarost").hide();
        $("#tab_ubior").hide();
        $("#tab_wyglad").show();
        $("#wyglad").css("background-color", "cornflowerblue");
        alt.emit("changeCameraTwarz");
    });

    $("#ubior").click(function(){
        $("#wyglad").css("background-color", "transparent");
        $("#wlosy_zarost").css("background-color", "transparent");
        $("#tab_wlosy_zarost").hide();
        $("#tab_wyglad").hide();
        $("#tab_ubior").show();
        $("#ubior").css("background-color", "cornflowerblue");
        alt.emit("changeCameraEntity");
    });
});

$(document).ready(function(){
    $('input[type=radio][name=gender]').change(function() {
        let sex = this.value
        alt.emit("changeSex", sex);
        alert(sex);
    });

    $('input[type=radio][name=ojciec]').change(function() {
        let dadFace = $('input[name=ojciec]:checked').val();
        let momFace = $('input[name=matka]:checked').val();
        let podobienstwo = $("#podobienstwo_slider").val();     // $("#").val()
        let eyeColor = $('input[name=color]:checked').val();
        let kolorSkory = $('input[name=skin_color_radio]:checked').val();
        alt.emit("updatePedHeadBlendData", dadFace, momFace, podobienstwo, kolorSkory);
        //alert(this.value);
    });

    $('input[type=radio][name=matka]').change(function() {
        let dadFace = $('input[name=ojciec]:checked').val();
        let momFace = $('input[name=matka]:checked').val();
        let podobienstwo = $("#podobienstwo_slider").val();     // $("#").val()
        let eyeColor = $('input[name=color]:checked').val();
        let kolorSkory = $('input[name=skin_color_radio]:checked').val();
        alt.emit("updatePedHeadBlendData", dadFace, momFace, podobienstwo, kolorSkory);
        //alert(dadFace + "" + momFace, podobienstwo, kolorSkory);
    });

    $('input[type=radio][name=skin_color_radio]').change(function() {
        let dadFace = $('input[name=ojciec]:checked').val();
        let momFace = $('input[name=matka]:checked').val();
        let podobienstwo = $("#podobienstwo_slider").val();     // $("#").val()
        let eyeColor = $('input[name=color]:checked').val();
        let kolorSkory = $('input[name=skin_color_radio]:checked').val();
        alt.emit("updatePedHeadBlendData", dadFace, momFace, podobienstwo, kolorSkory);
        //alert(dadFace + "" + momFace, podobienstwo, kolorSkory);
    });

    $('input[type=range][id=podobienstwo_slider]').on('input', function () {
        let dadFace = $('input[name=ojciec]:checked').val();
        let momFace = $('input[name=matka]:checked').val();
        let podobienstwo = $("#podobienstwo_slider").val();     // $("#").val()
        let eyeColor = $('input[name=color]:checked').val();
        let kolorSkory = $('input[name=skin_color_radio]:checked').val();
        alt.emit("updatePedHeadBlendData", dadFace, momFace, podobienstwo, kolorSkory);
        //alert(this.value);
    });

    $('input[type=range][id=fryzura_slider]').on('input', function () {
        let hairStyle = $("#fryzura_slider").val();
        let maxHairSliderValue = document.getElementById("fryzura_slider").max;
        $("#fryzura_value").text(`${hairStyle} / ${maxHairSliderValue}`);
        alt.emit("updatePedHair", hairStyle);
        //alert(this.value);
    });

    $('input[type=radio][name=wlosy_kolor_radio]').change(function() {
        let hairColor = this.value
        alt.emit("updatePedHairColor", hairColor);
    });

    $('input[type=radio][name=color]').change(function() {
        let eyeColor = this.value
        alt.emit("updatePedEyeColor", eyeColor);
    });

    // 
    $('input[type=range][id=rumience_slider]').on('input', function () {
        let rumience = $("#rumience_slider").val();
        let rumienceIntensywnosc = $("#intensivity_rumience_slider").val();
        $("#rumience_value").text(`${rumience} / 33`);
        alt.emit("updatePedRumience", rumience, rumienceIntensywnosc);
    });

    $('input[type=range][id=intensivity_rumience_slider]').on('input', function () {
        let rumience = $("#rumience_slider").val();
        let rumienceIntensywnosc = $("#intensivity_rumience_slider").val();
        $("#rumience_intensivity_value").text(`${rumienceIntensywnosc} / 10`);
        alt.emit("updatePedRumience", rumience, rumienceIntensywnosc);
    });

    $('input[type=radio][name=rumience_color_radio]').change(function() {
        let rumienceColor = this.value
        alt.emit("updatePedRumienceColor", rumienceColor);
    });

    //
    $('input[type=range][id=skazy_slider]').on('input', function () {
        let skazy = $("#skazy_slider").val();
        let skazyIntenstywnosc = $("#skazy_slider_intenstynosc").val();
        $("#skazy_value").text(`${skazy} / 24`);
        alt.emit("updatePedSkazy", skazy, skazyIntenstywnosc);
    });

    $('input[type=range][id=skazy_slider_intenstynosc]').on('input', function () {
        let skazy = $("#skazy_slider").val();
        let skazyIntenstywnosc = $("#skazy_slider_intenstynosc").val();
        $("#skazy_intensivity_value").text(`${skazyIntenstywnosc} / 10`);
        alt.emit("updatePedSkazy", skazy, skazyIntenstywnosc);
    });

    //
    $('input[type=range][id=zmarszczki_slider]').on('input', function () {
        let zmarszczki = $("#zmarszczki_slider").val();
        let zmarszczkiIntenstywnosc = $("#intenstywnosc_zmarszczek_slider").val();
        $("#zmarszczki_value").text(`${zmarszczki} / 14`);
        alt.emit("updatePedZmarszczki", zmarszczki, zmarszczkiIntenstywnosc);
    });

    $('input[type=range][id=intenstywnosc_zmarszczek_slider]').on('input', function () {
        let zmarszczki = $("#zmarszczki_slider").val();
        let zmarszczkiIntenstywnosc = $("#intenstywnosc_zmarszczek_slider").val();
        $("#zmarszczki_intensivity_value").text(`${zmarszczkiIntenstywnosc} / 10`);
        alt.emit("updatePedZmarszczki", zmarszczki, zmarszczkiIntenstywnosc);
    });

    //
    $('input[type=range][id=piegi_slider]').on('input', function () {
        let piegi = $("#piegi_slider").val();
        let piegiIntenstywnosc = $("#intensivity_piegi_slider").val();
        $("#piegi_value").text(`${piegi} / 18`);
        alt.emit("updatePedPiegi", piegi, piegiIntenstywnosc);
    });

    $('input[type=range][id=intensivity_piegi_slider]').on('input', function () {
        let piegi = $("#piegi_slider").val();
        let piegiIntenstywnosc = $("#intensivity_piegi_slider").val();
        $("#piegi_intensivity_value").text(`${piegiIntenstywnosc} / 10`);
        alt.emit("updatePedPiegi", piegi, piegiIntenstywnosc);
    });

    //
    $('input[type=range][id=makeup_slider]').on('input', function () {
        let makijaz = $("#makeup_slider").val();
        let makijazIntenstywnosc = $("#intensivity_makeup_slider").val();
        $("#makeup_value").text(`${makijaz} / 72`);
        alt.emit("updatePedMakijaz", makijaz, makijazIntenstywnosc);
    });

    $('input[type=range][id=intensivity_makeup_slider]').on('input', function () {
        let makijaz = $("#makeup_slider").val();
        let makijazIntenstywnosc = $("#intensivity_makeup_slider").val();
        $("#makeup_intensivity_value").text(`${makijazIntenstywnosc} / 10`);
        alt.emit("updatePedMakijaz", makijaz, makijazIntenstywnosc);
    });

    //
    $('input[type=range][id=szminka_slider]').on('input', function () {
        let szminka = $("#szminka_slider").val();
        let szminkaIntenstywnosc = $("#intensivity_szminka_slider").val();
        $("#szminka_value").text(`${szminka} / 9`);
        alt.emit("updatePedSzminka", szminka, szminkaIntenstywnosc);
    });

    $('input[type=range][id=intensivity_szminka_slider]').on('input', function () {
        let szminka = $("#szminka_slider").val();
        let szminkaIntenstywnosc = $("#intensivity_szminka_slider").val();
        $("#szminka_intensivity_value").text(`${szminkaIntenstywnosc} / 10`);
        alt.emit("updatePedSzminka", szminka, szminkaIntenstywnosc);
    });

    //   
    $('input[type=radio][name=makijaz_color_radio]').change(function() {
        let makeupColor = $('input[name=makijaz_color_radio]:checked').val();
        let makeupColor2 = this.value;
        alt.emit("updatePedMakeupColor", makeupColor);
        //notyAlertError("Zmiana koloru szminki")
    });

    //
    $('input[type=range][id=brwi_slider]').on('input', function () {
        let brwi = $("#brwi_slider").val();
        let brwiGrubosc = $("#brwi_grubosc_slider").val();
        $("#brwi_value").text(`${brwi} / 34`);
        alt.emit("updatePedBrwi", brwi, brwiGrubosc);
    });

    $('input[type=range][id=brwi_grubosc_slider]').on('input', function () {
        let brwi = $("#brwi_slider").val();
        let brwiGrubosc = $("#brwi_grubosc_slider").val();
        $("#brwi_intensivity_value").text(`${brwiGrubosc} / 10`);
        alt.emit("updatePedBrwi", brwi, brwiGrubosc);
    });

    $('input[type=radio][name=brwi_kolor_radio]').change(function() {
        let brwiColor = this.value
        alt.emit("updatePedBrwiColor", brwiColor);
    });

    //
    $('input[type=range][id=broda_slider]').on('input', function () {
        let broda = $("#broda_slider").val();
        let brodaGestosc = $("#broda_gestosc_slider").val();
        $("#broda_value").text(`${broda} / 29`);
        alt.emit("updatePedBroda", broda, brodaGestosc);
    });

    $('input[type=range][id=broda_gestosc_slider]').on('input', function () {
        let broda = $("#broda_slider").val();
        let brodaGestosc = $("#broda_gestosc_slider").val();
        $("#broda_intensivity_value").text(`${brodaGestosc} / 10`);
        alt.emit("updatePedBroda", broda, brodaGestosc);
    });

    $('input[type=radio][name=broda_kolor_radio]').change(function() {
        let brodaColor = this.value
        alt.emit("updatePedBrodaColor", brodaColor);
    });

    //
    $('input[type=range][id=postarzenie_slider]').on('input', function () {
        let postarzenie = $("#postarzenie_slider").val();
        let postarzenieIntensywnosc = $("#intensivity_postarzenie_slider").val();
        $("#postarzenie_value").text(`${postarzenie} / 15`);
        alt.emit("updatePedPostarzenie", postarzenie, postarzenieIntensywnosc);
    });

    $('input[type=range][id=intensivity_postarzenie_slider]').on('input', function () {
        let postarzenie = $("#postarzenie_slider").val();
        let postarzenieIntensywnosc = $("#intensivity_postarzenie_slider").val();
        $("#postarzenie_intensivity_value").text(`${postarzenieIntensywnosc} / 10`);
        alt.emit("updatePedPostarzenie", postarzenie, postarzenieIntensywnosc);
    });

    //
    $('input[type=range][id=tops_slider]').on('input', function () {
        let tops = $("#tops_slider").val();
        let maxTopsSliderValue = document.getElementById("tops_slider").max;
        $("#tops_value").text(`${tops} / ${maxTopsSliderValue}`);
        alt.emit("updatePedComponent", 11, tops);
    });

    $('input[type=range][id=tops_variations_slider]').on('input', function () {
        let tops = $("#tops_slider").val();
        let topsVariations = $("#tops_variations_slider").val();
        let maxTopsVariationsSliderValue = document.getElementById("tops_variations_slider").max;
        $("#tops_variations_value").text(`${topsVariations} / ${maxTopsVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 11, tops, topsVariations);
    });

    //
    $('input[type=range][id=tshirt_slider]').on('input', function () {
        let tshirt = $("#tshirt_slider").val();
        let maxTshirtSliderValue = document.getElementById("tshirt_slider").max;
        $("#tshirt_value").text(`${tshirt} / ${maxTshirtSliderValue}`);
        alt.emit("updatePedComponent", 8, tshirt);
    });

    $('input[type=range][id=tshirt_variations_slider]').on('input', function () {
        let tshirt = $("#tshirt_slider").val();
        let tshirtVariations = $("#tshirt_variations_slider").val();
        let maxtshirtVariationsSliderValue = document.getElementById("tshirt_variations_slider").max;
        $("#tshirt_variations_value").text(`${tshirtVariations} / ${maxtshirtVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 8, tshirt, tshirtVariations);
    });

    //
    $('input[type=range][id=ramiona_slider]').on('input', function () {
        let ramiona = $("#ramiona_slider").val();
        let maxRamionaSliderValue = document.getElementById("ramiona_slider").max;
        $("#ramiona_value").text(`${ramiona} / ${maxRamionaSliderValue}`);
        alt.emit("updatePedComponent", 3, ramiona);
    });

    $('input[type=range][id=ramiona_variations_slider]').on('input', function () {
        let ramiona = $("#ramiona_slider").val();
        let ramionaVariations = $("#ramiona_variations_slider").val();
        let maxRamionaVariationsSliderValue = document.getElementById("ramiona_variations_slider").max;
        $("#ramiona_variations_value").text(`${ramionaVariations} / ${maxRamionaVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 3, ramiona, ramionaVariations);
    });

    //
    $('input[type=range][id=spodnie_slider]').on('input', function () {
        let spodnie = $("#spodnie_slider").val();
        let maxSpodnieSliderValue = document.getElementById("spodnie_slider").max;
        $("#spodnie_value").text(`${spodnie} / ${maxSpodnieSliderValue}`);
        alt.emit("updatePedComponent", 4, spodnie);
    });

    $('input[type=range][id=spodnie_variations_slider]').on('input', function () {
        let spodnie = $("#spodnie_slider").val();
        let spodnieVariations = $("#spodnie_variations_slider").val();
        let maxSpodnieVariationsSliderValue = document.getElementById("spodnie_variations_slider").max;
        $("#spodnie_variations_value").text(`${spodnieVariations} / ${maxSpodnieVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 4, spodnie, spodnieVariations);
    }); 

    //
    $('input[type=range][id=buty_slider]').on('input', function () {
        let buty = $("#buty_slider").val();
        let maxButySliderValue = document.getElementById("buty_slider").max;
        $("#buty_value").text(`${buty} / ${maxButySliderValue}`);
        alt.emit("updatePedComponent", 6, buty);
    });

    $('input[type=range][id=buty_variations_slider]').on('input', function () {
        let buty = $("#buty_slider").val();
        let butyVariations = $("#buty_variations_slider").val();
        let maxButyVariationsSliderValue = document.getElementById("buty_variations_slider").max;
        $("#buty_variations_value").text(`${butyVariations} / ${maxButyVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 6, buty, butyVariations);
    });

    //
    $('input[type=range][id=glowa_slider]').on('input', function () {
        let glowa = $("#glowa_slider").val();
        let maxGlowaSliderValue = document.getElementById("glowa_slider").max;
        $("#glowa_value").text(`${glowa} / ${maxGlowaSliderValue}`);
        alt.emit("updatePedProp", 0, glowa);
    });

    $('input[type=range][id=glowa_variations_slider]').on('input', function () {
        let glowa = $("#glowa_slider").val();
        let glowaVariations = $("#glowa_variations_slider").val();
        let maxGlowaVariationsSliderValue = document.getElementById("glowa_variations_slider").max;
        $("#glowa_variations_value").text(`${glowaVariations} / ${maxGlowaVariationsSliderValue}`);
        alt.emit("updatePedPropVariations", 0, glowa, glowaVariations);
    });

    //
    $('input[type=range][id=okulary_slider]').on('input', function () {
        let okulary = $("#okulary_slider").val();
        let maxOkularySliderValue = document.getElementById("okulary_slider").max;
        $("#okulary_value").text(`${okulary} / ${maxOkularySliderValue}`);
        alt.emit("updatePedProp", 1, okulary);
    });

    $('input[type=range][id=okulary_variations_slider]').on('input', function () {
        let okulary = $("#okulary_slider").val();
        let okularyVariations = $("#okulary_variations_slider").val();
        let maxokularyVariationsSliderValue = document.getElementById("okulary_variations_slider").max;
        $("#okulary_variations_value").text(`${okularyVariations} / ${maxokularyVariationsSliderValue}`);
        alt.emit("updatePedPropVariations", 1, okulary, okularyVariations);
    });

    //
    $('input[type=range][id=uszy_slider]').on('input', function () {
        let uszy = $("#uszy_slider").val();
        let maxUszySliderValue = document.getElementById("uszy_slider").max;
        $("#uszy_value").text(`${uszy} / ${maxUszySliderValue}`);
        alt.emit("updatePedProp", 2, uszy);
    });

    $('input[type=range][id=uszy_variations_slider]').on('input', function () {
        let uszy = $("#uszy_slider").val();
        let uszyVariations = $("#uszy_variations_slider").val();
        let maxUszyVariationsSliderValue = document.getElementById("uszy_variations_slider").max;
        $("#uszy_variations_value").text(`${uszyVariations} / ${maxUszyVariationsSliderValue}`);
        alt.emit("updatePedPropVariations", 2, uszy, uszyVariations);
    }); 

    //
    $('input[type=range][id=akcesoria_slider]').on('input', function () {
        let akcesoria = $("#akcesoria_slider").val();
        let maxAkcesoriaSliderValue = document.getElementById("akcesoria_slider").max;
        $("#akcesoria_value").text(`${akcesoria} / ${maxAkcesoriaSliderValue}`);
        alt.emit("updatePedComponent", 7, akcesoria);
    });

    $('input[type=range][id=akcesoria_variations_slider]').on('input', function () {
        let akcesoria = $("#akcesoria_slider").val();
        let akcesoriaVariations = $("#akcesoria_variations_slider").val();
        let maxAkcesoriaVariationsSliderValue = document.getElementById("akcesoria_variations_slider").max;
        $("#akcesoria_variations_value").text(`${akcesoriaVariations} / ${maxAkcesoriaVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 7, akcesoria, akcesoriaVariations);
    });

    //
    $('input[type=range][id=oznaczenia_slider]').on('input', function () {
        let oznaczenia = $("#oznaczenia_slider").val();
        let maxOznaczeniaSliderValue = document.getElementById("oznaczenia_slider").max;
        $("#oznaczenia_value").text(`${oznaczenia} / ${maxOznaczeniaSliderValue}`);
        alt.emit("updatePedComponent", 10, oznaczenia);
    });

    $('input[type=range][id=oznaczenia_variations_slider]').on('input', function () {
        let oznaczenia = $("#oznaczenia_slider").val();
        let oznaczeniaVariations = $("#oznaczenia_variations_slider").val();
        let maxOznaczeniaVariationsSliderValue = document.getElementById("oznaczenia_variations_slider").max;
        $("#oznaczenia_variations_value").text(`${oznaczeniaVariations} / ${maxOznaczeniaVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 10, oznaczenia, oznaczeniaVariations);
    });

    //
    $('input[type=range][id=kamizelki_slider]').on('input', function () {
        let kamizelki = $("#kamizelki_slider").val();
        let maxKamizelkiSliderValue = document.getElementById("kamizelki_slider").max;
        $("#kamizelki_value").text(`${kamizelki} / ${maxKamizelkiSliderValue}`);
        alt.emit("updatePedComponent", 9, kamizelki);
    });

    $('input[type=range][id=kamizelki_variations_slider]').on('input', function () {
        let kamizelki = $("#kamizelki_slider").val();
        let kamizelkiVariations = $("#kamizelki_variations_slider").val();
        let maxKamizelkiVariationsSliderValue = document.getElementById("kamizelki_variations_slider").max;
        $("#kamizelki_variations_value").text(`${kamizelkiVariations} / ${maxKamizelkiVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 9, kamizelki, kamizelkiVariations);
    });

    //
    $('input[type=range][id=torby_slider]').on('input', function () {
        let torby = $("#torby_slider").val();
        let maxTorbySliderValue = document.getElementById("torby_slider").max;
        $("#torby_value").text(`${torby} / ${maxTorbySliderValue}`);
        alt.emit("updatePedComponent", 5, torby);
    });

    $('input[type=range][id=torby_variations_slider]').on('input', function () {
        let torby = $("#torby_slider").val();
        let torbyVariations = $("#torby_variations_slider").val();
        let maxTorbyVariationsSliderValue = document.getElementById("torby_variations_slider").max;
        $("#torby_variations_value").text(`${torbyVariations} / ${maxTorbyVariationsSliderValue}`);
        alt.emit("updatePedComponentVariations", 5, torby, torbyVariations);
    });

    $('input[type=range][id=ped_rotation_slider]').on('input', function () {
        let rotation = $("#ped_rotation_slider").val();
        alt.emit("setPedRotation", rotation);
    });

    $('input[type=range][id=ped_ped_cam_height_slider]').on('input', function () {
        let height = $("#ped_ped_cam_height_slider").val();
        alt.emit("setPedCamHeight", height);
    });
});


function notyAlertError(txt) {
    new Noty({
        theme: "mint",
        type: 'error',
        conatainer: ".error_layout",
        layout: 'topRight',
        text: txt,
        progressBar: true,
        timeout: 3000,
    }).show();
};



$(document).ready(function(){
    alt.emit("documentReady")
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

/*
$(document).ready(function(){
    let i
    for (i = 5; i < 28; i++) {
        console.log(
        `
        .custom-radios input[type="radio"]#rumience_color_radio_${i} + label span {
            background-color: rgb(216, 193, 172);
            display: flex;  
            justify-content: center;  
            align-items: center;
            width: 30;
            height: 30;
            margin: 4px 4px 0 0;
        }
        `
        
        );
    };
});

*/