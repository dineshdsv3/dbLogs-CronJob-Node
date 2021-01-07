import mongoose from 'mongoose';

const modelSchema = mongoose.Schema(
	{   
		element: {
			type: String,
			required: true,
		},
		intervalTime: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Model = mongoose.model('Model', modelSchema);

export default Model;
