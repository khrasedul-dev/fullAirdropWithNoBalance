const {Telegraf , Composer, Stage , session , BaseScene , WizardScene} = require('micro-bot')
const mongoose = require('mongoose')

const userModel = require('./userModel')
const checkGroup = require('./checkGroup')


// const bot = new Telegraf('5011458623:AAFkMzKdlX7I0CXh8pTy7JH7HOj_owom00A')
const bot = new Composer()


mongoose.connect('mongodb+srv://rasedul20:rasedul20@telegramproject.w3ip3.mongodb.net/telegramProject?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true}).catch((e)=>{
        console.log(e)
}).then((d)=>console.log('Database connected')).catch((e)=>console.log(e))




bot.use(session({
	property: 'user',
	getSessionKey: (ctx) => ctx.chat && ctx.chat.id,
}))



bot.action('join',ctx=>{
    
    ctx.telegram.sendMessage(ctx.chat.id , `Task 1: \n\nPlease Join our telegram gorup (If you are already a member of our group send the word "Airdrop" as a messsage in the group, then return here and click done to continue) \n\nhttps://t.me/dogymonapp \n\nClick done to proceed after you have joined` ,{
        reply_markup: {
            inline_keyboard: [
                [{text: "Done", callback_data: "groupJoin"}]
            ]
        }
    }).catch((e)=>console.log(" Something is wrong"))
})

bot.action('groupJoin', (ctx)=>{

    const data = checkGroup.find({userId: ctx.from.id})
            
     data.then((data)=>{

		if (data.length > 0) {
                
                
                ctx.telegram.sendMessage(ctx.chat.id , `Task 2: \n\nPlease Join our telegram channel \nhttps://t.me/dogymonchannel \n\nClick done to proceed after you have joined` ,{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Done", callback_data: "channelJoin"}]
                        ]
                    }
                }).catch((e)=>console.log(" Something is wrong"))

            } else {
                
               
                ctx.telegram.sendMessage(ctx.chat.id , `Task 1: \n\nPlease Join our telegram gorup (If you are already a member of our group send the word "Airdrop" as a messsage in the group, then return here and click done to continue) \n\nhttps://t.me/dogymonapp \n\nClick done to proceed after you have joined` ,{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Done", callback_data: "groupJoin"}]
                        ]
                    }
                }).catch((e)=>console.log(" Something is wrong"))
            }

	}).catch((e)=>console.log("Something is wrong"))


})

const input_form = new WizardScene('input_data',
    (ctx)=>{
	
	

        ctx.user.userId = ctx.from.id
        ctx.user.userName = ctx.from.first_name

        ctx.reply( `Task 3: \n\nA. Click the link: \nhttps://twitter.com/DogymonApp \n\nFollow us on Twitter \nB. Like one of our Twitter posts, make a Twitter comment and retweet our post  \n\nNote: you must retweet our post, not some other person's post \n\nWhen you are done, return here and enter your Twitter username to proceed. \n\nOur team will manually verify if you have completed this task`).catch((e)=>console.log(" Something is wrong"))
        return ctx.wizard.next()
    },
    (ctx)=>{

        ctx.user.twitter = ctx.update.message.text

        ctx.reply( `Task 4: \n\nA. Click the link:\nhttps://www.reddit.com/r/DogymonFinance/ \n\nFollow us on Reddit, Comment and share one of our posts there. \n\nNote you must comment and share our post, not some other person's post \n\nWhen you are done, return here and enter your Reddit username to proceed. \n\nOur team will manually verify if you have completed this task`).catch((e)=>console.log(" Something is wrong"))
        return ctx.wizard.next()
    },
    (ctx)=>{

        ctx.user.reddit = ctx.update.message.text

        ctx.reply( `Task 5: \n\nA. Click the link: \nhttps://facebook.com/dogymonapp \n\nLike us on Facebook Comment and share one of our posts there. \n\nNote you must comment and share our post, not some other person's post \n\nWhen you are done, return here and write your full name on facebook to proceed. (Note that if you don't provide us with your full name on facebook our admins may not verify it's you because multiple persons may bear same single name on facebook)`).catch((e)=>console.log(" Something is wrong"))
        return ctx.wizard.next()
    },
    (ctx)=>{
	
        ctx.user.facebook = ctx.update.message.text

        ctx.reply( `Task 6: \n\nDrop your BEP-20 wallet address to receive your dogymon token if you win`).catch(()=>console.log(" Something is wrong"))
        return ctx.wizard.next()
    },
    (ctx)=>{
	
        userModel.find({userId: ctx.from.id},(e,data)=>{

            if (e) {
                throw e
            } else {
                if (data.length > 0) {
			console.log(ctx.user)

                    const ref_id = parseInt(data[0].referrer_id)

                    const inputData = {
                        twitter: ctx.user.twitter,
                        reddit: ctx.user.reddit,
                        facebook: ctx.user.facebook,
                        wallet:  ctx.update.message.text
                    }
                    
                    userModel.updateOne({userId: ctx.from.id},inputData,(e,data)=>{
                        if (e) {
                            throw e
                        } else {
                            userModel.find({userId: ref_id},(e,data2)=>{
                                if (e) {
                                    throw e
                                } else {
                                    const ref_count = parseInt(data2[0].referral_count)

                                    const update_ref = {
                                        referral_count : ref_count + 1
                                    }
                                    userModel.updateOne({userId: ref_id},update_ref, (e,data)=>{
                                        if (e) {
                                            throw e
                                        } else {
                                            
                                            ctx.telegram.sendMessage(ctx.chat.id , `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${ctx.update.message.text} \nReferral Users - 0 \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 0.5 bnb worth of tokens each to 150 persons with the highest number of referrals. so it all depends on your number of referrals .Start sharing your link with your friends now. Good luck`,{
                                                reply_markup: {
                                                    inline_keyboard: [
                                                        [{text: "Start", callback_data: "start"}]
                                                    ]
                                                }
                                            }).catch((e)=>console.log(" Something is wrong"))
                                        }
                                    })
                                }
                            })
                        }
                    })


                } else {

			console.log(ctx.user)
                    
                    const inputData = new userModel({
                        userId: ctx.from.id,
                        name: ctx.from.first_name,
                        twitter: ctx.user.twitter,
                        reddit: ctx.user.reddit,
                        facebook: ctx.user.facebook,
                        wallet:  ctx.update.message.text,
                        referral_count: '0'
                    })

                    inputData.save((e)=>{

                        if (e) {
                            throw e
                        } else {

                            ctx.telegram.sendMessage(ctx.chat.id , `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${ctx.update.message.text} \nReferral Users - 0 \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 0.5 bnb worth of tokens each to 150 persons with the highest number of referrals. so it all depends on your number of referrals .Start sharing your link with your friends now. Good luck`,{
                                reply_markup: {
                                    inline_keyboard: [
                                        [{text: "Start", callback_data: "start"}]
                                    ]
                                }
                            }).catch((e)=>console.log(" Something is wrong"))
                        }
                    })
                }
            }
        })



        return ctx.scene.leave()
    }
)








const stage = new Stage([input_form],{sessionName: 'user'})

bot.use(stage.middleware())





bot.action('channelJoin', Stage.enter('input_data'))


bot.start((ctx)=>{

    const ref = ctx.startPayload

    const data = userModel.find({
    userId: ctx.from.id
})


data.then((data) => {

    if (data.length > 0) {

        const wallet = data[0].wallet

        ctx.telegram.sendMessage(ctx.from.id, `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${wallet} \nReferral Users - 0 \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id} \n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 1bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Refresh",
                        callback_data: "start"
                    }]
                ]
            }
        }).catch((e) => console.log(" Something is wrong"))

    } else {




        if (ref.length > 0) {

            const inputData = new userModel({
                userId: ctx.from.id,
                name: ctx.from.first_name,
                referrer_id: ref,
                referral_count: 0
            })

            const data = inputData.save()

            data.then((data) => {


                ctx.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}, \nWelcome to Dogymon Airdrop Contest.\n\nWe will be giving 0.5BNB worth of dogymon tokens each to 150 winners who have completed our simple airdrop tax and had the most number of referrals. \n\nClick the start button below to join the contest.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "Start",
                                callback_data: "join"
                            }]
                        ]
                    }
                }).catch((e) => console.log(" Something is wrong"))


            }).catch((e) => console.log("Something is wrong "))




        } else {

            ctx.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}, \nWelcome to Dogymon Airdrop Contest.\n\nWe will be giving 0.5BNB worth of dogymon tokens each to 150 winners who have completed our simple airdrop tax and had the most number of referrals. \n\nClick the start button below to join the contest.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Start",
                            callback_data: "join"
                        }]
                    ]
                }
            }).catch((e) => console.log(" Something is wrong"))
        }

    }


}).catch((e) => ctx.reply("Please try again"))

})


bot.action("start", (ctx)=>{

    	const data = userModel.find({userId: ctx.from.id})
    	data.then((data)=>{
            ctx.telegram.sendMessage(ctx.from.id, `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${data[0].wallet} \nReferral Users - ${data[0].referral_count || '0'} \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id} \n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 1bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck`,{
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Refresh", callback_data: "start"}]
                    ]
                }
            }).catch((e)=>console.log(" Something is wrong"))
	}).catch((e)=>ctx.reply("Please try with /start"))
})









bot.on('new_chat_members', (ctx)=>{

	const data = checkGroup.find({userId: ctx.from.id})

             data.then((data)=>{

                        if (data.length > 0) {
                                console.log("User Already Added")
                        } else {

                            const data = new checkGroup({
                                    userId: ctx.from.id
                            })
                            const d = data.save()
				d.catch((e)=>console.log("Something is wrong"))
                        }    
                   
         }).catch((e)=>console.log("Something is wrong"))
    
})


bot.on('text', (ctx)=>{

    const message = ctx.update.message.text

    const r = /Airdrop/gi

    if ( message.match(r)) {

	     const data = checkGroup.find({userId: ctx.from.id})

             data.then((data)=>{

                        if (data.length > 0) {
                                console.log("User Already Added")
                        } else {

                            const data = new checkGroup({
                                    userId: ctx.from.id
                            })
                            const d = data.save()
				d.catch((e)=>console.log("Something is wrong"))
                        }    
                   
            }).catch((e)=>console.log("Something is wrong"))
            
    }

})




// bot.launch()
module.exports = bot
