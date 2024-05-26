import { isValidObjectId } from "mongoose";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  contactsService
    .listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => res.status(500).json("Internal Server Error"));
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  contactsService
    .getContactById(id)
    .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => {
      res.status(500).json("Internal Server Error");
    });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  contactsService
    .removeContact(id)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => res.status(500).json("Internal Server Error"));
};

export const createContact = async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  contactsService
    .addContact(name, email, phone, favorite)
    .then((contact) => {
      res.status(201).json(contact);
    })
    .catch((err) => res.status(500).json("Internal Server Error"));
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  const { name, email, phone, favorite } = req.body;

  if (name === undefined && email === undefined && phone === undefined) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsService
    .updateContact(id, favorite, name, email, phone)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => res.status(500).json("Internal Server Error"));
};

export const updateContactFavorite = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  const { favorite } = req.body;
  contactsService
    .updateContact(id, favorite)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => res.status(500).json("Internal Server Error"));
};