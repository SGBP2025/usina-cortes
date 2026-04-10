#!/usr/bin/env python3
"""
Transcrição via faster-whisper.
Uso: python transcribe.py <audio_path> [model_size]
Saída: JSON array com {word, start, end} para stdout
"""
import sys
import json
from faster_whisper import WhisperModel

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Uso: transcribe.py <audio_path> [model_size]"}))
        sys.exit(1)

    audio_path = sys.argv[1]
    model_size = sys.argv[2] if len(sys.argv) > 2 else "small"

    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    segments, _ = model.transcribe(
        audio_path,
        word_timestamps=True,
        language="pt",
        vad_filter=True,
    )

    words = []
    for segment in segments:
        if segment.words:
            for w in segment.words:
                words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                })

    print(json.dumps(words))

if __name__ == "__main__":
    main()
