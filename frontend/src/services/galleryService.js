// Gallery Service - localStorage based
import { v4 as uuid } from "uuid";

const LS_KEY = "tcs_gallery";

const DEFAULT_GALLERY = [
    {
        id: "cat-1", title: "Orientation Day",
        images: [
            "/src/assets/images/image1.png", "/src/assets/images/image10.png",
            "/src/assets/images/image11.png", "/src/assets/images/image12.png",
            "/src/assets/images/image13.png", "/src/assets/images/image14.png",
            "/src/assets/images/image15.png", "/src/assets/images/image2.png"
        ]
    },
    {
        id: "cat-2", title: "Tech Talk Series",
        images: [
            "/src/assets/images/image13.png", "/src/assets/images/image14.png",
            "/src/assets/images/image15.png", "/src/assets/images/image2.png",
            "/src/assets/images/image3.png", "/src/assets/images/image4.png",
            "/src/assets/images/image5.png", "/src/assets/images/image6.png"
        ]
    },
    {
        id: "cat-3", title: "Hackathon Night",
        images: [
            "/src/assets/images/image3.png", "/src/assets/images/image4.png",
            "/src/assets/images/image5.png", "/src/assets/images/image6.png",
            "/src/assets/images/image7.png", "/src/assets/images/image8.png",
            "/src/assets/images/image9.png", "/src/assets/images/image1.png"
        ]
    },
    {
        id: "cat-4", title: "Sports Gala",
        images: [
            "/src/assets/images/image7.png", "/src/assets/images/image8.png",
            "/src/assets/images/image9.png", "/src/assets/images/image1.png",
            "/src/assets/images/image10.png", "/src/assets/images/image11.png",
            "/src/assets/images/image12.png", "/src/assets/images/image13.png"
        ]
    },
    {
        id: "cat-5", title: "Seminar & Workshop",
        images: [
            "/src/assets/images/image10.png", "/src/assets/images/image11.png",
            "/src/assets/images/image12.png", "/src/assets/images/image13.png",
            "/src/assets/images/image14.png", "/src/assets/images/image15.png",
            "/src/assets/images/image2.png", "/src/assets/images/image3.png"
        ]
    },
    {
        id: "cat-6", title: "Freshers Party",
        images: [
            "/src/assets/images/image14.png", "/src/assets/images/image15.png",
            "/src/assets/images/image2.png", "/src/assets/images/image3.png",
            "/src/assets/images/image4.png", "/src/assets/images/image5.png",
            "/src/assets/images/image6.png", "/src/assets/images/image7.png"
        ]
    }
];

export function listGalleryAlbums() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return DEFAULT_GALLERY;
}

export function getAlbum(id) {
    return listGalleryAlbums().find(a => a.id === id) || null;
}

export function createAlbum(data) {
    const list = listGalleryAlbums();
    const newItem = {
        id: uuid(),
        title: data.title || "New Album",
        images: data.images || []
    };
    list.push(newItem);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
    return newItem;
}

export function updateAlbum(id, data) {
    const list = listGalleryAlbums();
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        localStorage.setItem(LS_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("tcs:ls"));
    }
    return list[idx];
}

export function deleteAlbum(id) {
    const list = listGalleryAlbums().filter(a => a.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("tcs:ls"));
}

export function addImageToAlbum(albumId, imageUrl) {
    const list = listGalleryAlbums();
    const idx = list.findIndex(a => a.id === albumId);
    if (idx !== -1) {
        list[idx].images.push(imageUrl);
        localStorage.setItem(LS_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("tcs:ls"));
    }
}

export function removeImageFromAlbum(albumId, imageUrl) {
    const list = listGalleryAlbums();
    const idx = list.findIndex(a => a.id === albumId);
    if (idx !== -1) {
        list[idx].images = list[idx].images.filter(img => img !== imageUrl);
        localStorage.setItem(LS_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("tcs:ls"));
    }
}

export function resetGallery() {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_GALLERY));
    window.dispatchEvent(new Event("tcs:ls"));
    return DEFAULT_GALLERY;
}
