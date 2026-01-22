import dotenv from "dotenv";
dotenv.config();

async function checkAvailableModels() {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("❌ API Key KOSONG! Cek .env");
        return;
    }

    console.log("🔍 Sedang bertanya ke Google daftar model yang tersedia...");

    try {
        // Kita tembak langsung ke API Google
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
        );

        const data = await response.json();

        if (data.error) {
            console.error("\n❌ API KEY BERMASALAH:");
            console.error(JSON.stringify(data.error, null, 2));
            console.log("👉 Saran: Buat API Key baru di https://aistudio.google.com/");
        } else {
            console.log("\n✅ DAFTAR MODEL YANG BISA KAMU PAKAI:");
            console.log("-----------------------------------------");
            // Filter cuma model yang bisa generate text
            const available = data.models
                .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
                .map((m: any) => m.name.replace("models/", "")); // Hapus prefix 'models/'

            available.forEach((name: string) => console.log(`👉 "${name}"`));

            console.log("-----------------------------------------");
            console.log("Pilih salah satu nama di atas (paling atas biasanya paling baru) dan pasang di gemini.service.ts");
        }
    } catch (error) {
        console.error("❌ Gagal connect internet:", error);
    }
}

checkAvailableModels();