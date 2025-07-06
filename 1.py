import tkinter as tk
from pytube import YouTube

def download_video():
    url = entry.get()
    try:
        yt = YouTube(url)
        stream = yt.streams.get_highest_resolution()
        status_label.config(text=f"Скачивается: {yt.title}")
        stream.download()
        status_label.config(text="Видео успешно скачано!")
    except Exception as e:
        status_label.config(text=f"Ошибка: {e}")

root = tk.Tk()
root.title("YouTube Video Downloader")

tk.Label(root, text="Ссылка на видео:").pack()
entry = tk.Entry(root, width=50)
entry.pack()

tk.Button(root, text="Скачать", command=download_video).pack()
status_label = tk.Label(root, text="")
status_label.pack()

root.mainloop()