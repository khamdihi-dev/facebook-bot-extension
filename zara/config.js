export function __init__() {
    try {
        const dc = document.body.innerHTML;

        const avMatch = dc.match(/"actorId":"(\d+)"/);
        const av = avMatch ? avMatch[1] : null;

        const hsMatch = dc.match(/"haste_session":"(.*?)"/);
        const hs = hsMatch ? hsMatch[1] : null;

        const srMatch = dc.match(/"__spin_r":(\d+)/);
        const sr = srMatch ? parseInt(srMatch[1]) : null;

        const stMatch = dc.match(/"__spin_t":(\d+)/);
        const st = stMatch ? parseInt(stMatch[1]) : null;

        const hsiMatch = dc.match(/"hsi":"(\d+)"/);
        const hsi = hsiMatch ? hsiMatch[1] : null;

        const dtsgMatch = dc.match(/DTSGInitialData",\[\],{"token":"(.*?)"/);
        const dtsg = dtsgMatch ? dtsgMatch[1] : null;

        const lsdMatch = dc.match(/LSD",\[\],{"token":"(.*?)"/);
        const lsd = lsdMatch ? lsdMatch[1] : null;

        // Return semua data sebagai object
        return { av, hs, sr, st, hsi, dtsg, lsd };

    } catch (error) {
        console.error("Error parsing Post data:", error);
        return null; // fallback jika ada error
    }
}
