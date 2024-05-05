import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8"});
    return JSON.parse(data);
  }
  
  async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find(({ id }) => id === String(contactId)) || null;
     }            
  
  
  async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex(({ id }) => id === String(contactId));
    if (index === -1) {
        return null;
    }
    const removedContact = contacts[index];
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
    return removedContact;            
  }
  
  async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {id: crypto.randomUUID(), name, email, phone, };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
    return newContact;              
  }

  export default { listContacts, getContactById, removeContact, addContact };