const Staff = require('./../models/staffModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./../controllers/handleController');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.patient.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('You should update non-sensitive data only', 400));

  //We will use findByIdAndUpdate because we don't need to deal with passwords, we used save before to run our middlewares

  const filteredObj = filterObj(req.body, 'name', 'email');

  const updatedStaff = await Staff.findByIdAndUpdate(
    req.patient.id,
    filteredObj,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      patient: updatedStaff
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Staff.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllStaff = factory.getAll(Staff);
exports.getStaff = factory.getOne(Staff);
exports.updateStaff = factory.updateOne(Staff);
exports.deleteStaff = factory.deleteOne(Staff);
