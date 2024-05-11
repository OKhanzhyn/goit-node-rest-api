import contactsService from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
  contactsService
    .listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => res.status(500).json({ message: err.message }));
};

export const getOneContact = (req, res) => {
  const { id } = req.params;

  contactsService
    .getContactById(id)
    .then((contact) => {
      if (contact !== null) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch(() => res.status(404).json({ message: "Not found" }));
};

export const deleteContact = (req, res) => {
  const { id } = req.params;

  contactsService
    .removeContact(id)
    .then((contact) => {
      if (contact !== null) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch(() => res.status(404).json({ message: "Not found" }));
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;
  contactsService
    .addContact(name, email, phone)
    .then((contact) => res.status(201).json(contact))
    .catch((error) => res.status(400).json({ message: error.message }));
};

export const updateContact = (req, res) => {
  const { id } = req.params;

  const { name, email, phone } = req.body;

  if (name === undefined && email === undefined && phone === undefined) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsService
    .updateContact(id, name, email, phone)
    .then((contact) => {
      if (contact !== null) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch(() => res.status(404).json({ message: "Not found" }));
};