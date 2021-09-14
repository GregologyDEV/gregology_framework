/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client'
import * as native from 'natives';

alt.on('keydown', (key) => {
    if (key === 117) {
        alt.emitServer("voice:changeVoiceRange")
    }
});