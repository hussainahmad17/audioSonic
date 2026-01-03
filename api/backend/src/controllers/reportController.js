const FreeAudioDownload = require('../models/FreeAudioDownload');
const PaidAudioPurchase = require('../models/PaidAudioPurchase');
const CustomAudioRequest = require('../models/CustomAudioRequest');

const getFreeAudioReports = async (req, res) => {
  const records = await FreeAudioDownload.find().populate('audioId', 'title');
  res.json(records);
};

const getPaidAudioReports = async (req, res) => {
  const records = await PaidAudioPurchase.find().populate('audioId', 'title');
  res.json(records);
};

const getCustomAudioReports = async (req, res) => {
  const records = await CustomAudioRequest.find();
  res.json(records);
};

module.exports = { getFreeAudioReports, getPaidAudioReports, getCustomAudioReports };
