import { isValidObjectId } from "mongoose";
import contactsService from "../services/contactsServices.js";
export const getAllContacts = async (req, res, next) => {
  let { page = 1, limit = 20, favorite } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const filter = {
    owner: req.user.id,
  };

  if (favorite === "true") {
    filter.favorite = true;
  } else if (favorite === "false") {
    filter.favorite = false;
  }

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return res.status(400).json({ message: "Bad request." });
  }

  contactsService
    .listContacts(filter, page, limit)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  contactsService
    .getContactById(id, req.user.id)
    .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  contactsService
    .removeContact(id, req.user.id)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};

export const createContact = async (req, res, next) => {
  const { name, email, phone, favorite = false } = req.body;
  contactsService
    .addContact(req.user.id, name, email, phone, favorite)
    .then((contact) => {
      res.status(201).json(contact);
    })
    .catch((err) => next(err));
};

export const updateContact = async (req, res, next) => {
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
    .updateContact(id, req.user.id, favorite, name, email, phone)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  const { favorite } = req.body;
  contactsService
    .updateContact(id, req.user.id, favorite)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};