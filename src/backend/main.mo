import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";

actor {
  // Types
  type FaqItem = {
    order : Nat16;
    question : Text;
    answer : Text;
  };

  module FaqItem {
    public func compare(faq1 : FaqItem, faq2 : FaqItem) : Order.Order {
      Nat16.compare(faq1.order, faq2.order);
    };
  };

  type Testimonial = {
    id : Nat;
    name : Text;
    rating : Nat16;
    review : Text;
    timestamp : Time.Time;
  };

  module Testimonial {
    public func compare(test1 : Testimonial, test2 : Testimonial) : Order.Order {
      Nat.compare(test1.id, test2.id);
    };
  };

  type ContactFormSubmission = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  // Business Config
  type BusinessConfig = {
    name : Text;
    phone : Text;
    address : Text;
    whatsappNumber : Text;
    tagline : Text;
  };

  // Persistent State
  var nextTestimonialId = 0;
  var config : BusinessConfig = {
    name = "";
    phone = "";
    address = "";
    whatsappNumber = "";
    tagline = "";
  };

  let testimonials = Map.empty<Nat, Testimonial>();
  let faqs = Map.empty<Nat16, FaqItem>();
  let contactSubmissions = Map.empty<Nat, ContactFormSubmission>();

  // Public Queries
  public query ({ caller }) func getBusinessConfig() : async BusinessConfig {
    config;
  };

  public query ({ caller }) func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray().sort();
  };

  public query ({ caller }) func getFaqs() : async [FaqItem] {
    faqs.values().toArray().sort();
  };

  // Contact Form Submission (Public Update)
  public shared ({ caller }) func submitContactForm(name : Text, phone : Text, message : Text) : async () {
    let submission : ContactFormSubmission = {
      name;
      phone;
      message;
      timestamp = Time.now();
    };

    contactSubmissions.add(nextTestimonialId, submission);
    nextTestimonialId += 1;
  };

  // Admin Functions
  public shared ({ caller }) func updateBusinessConfig(newConfig : BusinessConfig) : async () {
    config := newConfig;
  };

  public shared ({ caller }) func addTestimonial(name : Text, rating : Nat16, review : Text) : async Nat {
    if (rating < 1 or rating > 5) { Runtime.trap("Rating must be between 1 and 5") };

    let testimonial : Testimonial = {
      id = nextTestimonialId;
      name;
      rating;
      review;
      timestamp = Time.now();
    };

    testimonials.add(nextTestimonialId, testimonial);
    nextTestimonialId += 1;
    nextTestimonialId - 1;
  };

  public shared ({ caller }) func removeTestimonial(id : Nat) : async () {
    if (not testimonials.containsKey(id)) { Runtime.trap("Testimonial does not exist") };
    testimonials.remove(id);
  };

  public shared ({ caller }) func addFaq(order : Nat16, question : Text, answer : Text) : async () {
    let faq : FaqItem = {
      order;
      question;
      answer;
    };
    faqs.add(order, faq);
  };

  public shared ({ caller }) func removeFaq(order : Nat16) : async () {
    if (not faqs.containsKey(order)) { Runtime.trap("FAQ item does not exist") };
    faqs.remove(order);
  };
};
