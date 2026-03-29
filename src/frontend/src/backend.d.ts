import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BusinessConfig {
    tagline: string;
    name: string;
    whatsappNumber: string;
    address: string;
    phone: string;
}
export type Time = bigint;
export interface FaqItem {
    question: string;
    order: number;
    answer: string;
}
export interface Testimonial {
    id: bigint;
    review: string;
    name: string;
    timestamp: Time;
    rating: number;
}
export interface backendInterface {
    addFaq(order: number, question: string, answer: string): Promise<void>;
    addTestimonial(name: string, rating: number, review: string): Promise<bigint>;
    getBusinessConfig(): Promise<BusinessConfig>;
    getFaqs(): Promise<Array<FaqItem>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    removeFaq(order: number): Promise<void>;
    removeTestimonial(id: bigint): Promise<void>;
    submitContactForm(name: string, phone: string, message: string): Promise<void>;
    updateBusinessConfig(newConfig: BusinessConfig): Promise<void>;
}
