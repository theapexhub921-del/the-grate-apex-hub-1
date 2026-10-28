// Textbook pages for each reading section of reproductive-physiology (printed page numbers),
// matched to the section's own lecture text: Costanzo Physiology; Guyton and Hall (14th ed.).
// A section only gets a page when the match is strong; sections whose
// lecture content the book does not cover are left without one.
// Added to the sections by buildTopic (see data/textbook-refs/index.ts).
import type { TextbookPages } from '@/data/textbook-refs/types';

export const textbookPages: TextbookPages = {
  "reproductive-physiology-1": {
    2: [["guyton-hall-14e", [1011]], ["costanzo-physiology", [466]]], // The testis
    3: [["guyton-hall-14e", [1011, 1012, 1013]], ["costanzo-physiology", [466]]], // Sertoli and Leydig cells
  },
  "reproductive-physiology-2": {
    0: [["guyton-hall-14e", [1012]], ["costanzo-physiology", [466]]], // Spermatogenesis
    2: [["guyton-hall-14e", [1013, 1014]], ["costanzo-physiology", [466]]], // Maturation and storage
    3: [["guyton-hall-14e", [1013, 1014, 1015]], ["costanzo-physiology", [466, 467]]], // Capacitation
  },
  "reproductive-physiology-3": {
    0: [["guyton-hall-14e", [1022, 1023]], ["costanzo-physiology", [468, 469]]], // Hormonal control
    1: [["guyton-hall-14e", [1015, 1016]], ["costanzo-physiology", [466]]], // Temperature
    2: [["guyton-hall-14e", [1014]], ["costanzo-physiology", [466]]], // Semen
  },
  "reproductive-physiology-4": {
    0: [["guyton-hall-14e", [1018, 1019]]], // Transport and secretion
    1: [["guyton-hall-14e", [1018, 1019, 1020]], ["costanzo-physiology", [469, 470]]], // How it acts
    2: [["guyton-hall-14e", [1018, 1019, 1020]], ["costanzo-physiology", [469, 470, 471]]], // Effects of androgens
    3: [["guyton-hall-14e", [1016]]], // Cryptorchidism
  },
  "reproductive-physiology-5": {
    1: [["guyton-hall-14e", [1027]], ["costanzo-physiology", [470, 471]]], // The ovary
    2: [["guyton-hall-14e", [1029]], ["costanzo-physiology", [471]]], // Oogenesis
    3: [["guyton-hall-14e", [1029, 1030, 1031]], ["costanzo-physiology", [471, 472, 473]]], // The follicular phase
    4: [["guyton-hall-14e", [1030, 1031, 1032]], ["costanzo-physiology", [471, 472, 473]]], // Ovulation and the luteal phase
  },
  "reproductive-physiology-6": {
    0: [["guyton-hall-14e", [1036, 1037]], ["costanzo-physiology", [471, 472, 473]]], // The uterine cycle
    2: [["guyton-hall-14e", [1038, 1039]], ["costanzo-physiology", [471, 472, 473]]], // The hypothalamic–pituitary–ovarian axis
  },
  "reproductive-physiology-7": {
    0: [["guyton-hall-14e", [1039, 1040, 1041]], ["costanzo-physiology", [471, 472, 473]]], // Anovulatory cycles
    2: [["guyton-hall-14e", [1033, 1034, 1035]], ["costanzo-physiology", [470, 471, 472]]], // Estrogens
    3: [["guyton-hall-14e", [1032, 1033, 1034]], ["costanzo-physiology", [470, 471, 472]]], // Progestins
  },
  "reproductive-physiology-8": {
    0: [["guyton-hall-14e", [1040]], ["costanzo-physiology", [465]]], // Puberty
    3: [["guyton-hall-14e", [1017]]], // Penile erection
  },
  "reproductive-physiology-9": {
    0: [["guyton-hall-14e", [1015]], ["costanzo-physiology", [466, 467]]], // Fertilisation
    1: [["guyton-hall-14e", [1032]], ["costanzo-physiology", [471]]], // Implantation
  },
  "reproductive-physiology-10": {
    1: [["guyton-hall-14e", [940]], ["costanzo-physiology", [401]]], // Mechanical factors and delivery
    2: [["guyton-hall-14e", [940]], ["costanzo-physiology", [414]]], // Lactogenesis
    3: [["guyton-hall-14e", [940]], ["costanzo-physiology", [418, 419]]], // The milk ejection reflex
    4: [["guyton-hall-14e", [917]], ["costanzo-physiology", [414]]], // Milk and lactational amenorrhoea
  },
};
