const {Telegraf , Composer, Stage , session , BaseScene , WizardScene} = require('micro-bot')
const mongoose = require('mongoose')

const userModel = require('./userModel')
const checkGroup = require('./checkGroup')


// const bot = new Telegraf('5011458623:AAFkMzKdlX7I0CXh8pTy7JH7HOj_owom00A')
const bot = new Composer()


mongoose.connect('mongodb+srv://rasedul20:rasedul20@telegramproject.w3ip3.mongodb.net/telegramProject?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true}).catch((e)=>{
        console.log(e)
}).then((d)=>console.log('Database connected')).catch((e)=>console.log(e))




bot.use(session())


// bot.action('scstart',ctx=>{
//     ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name}, \nWelcome to Dogymon Airdrop Contest. \n\nWe will be giving 1BNB worth of dogymon tokens each to 150 winners who have completed our simple airdrop tax and had the most number of referrals. \n\nClick the start button below to join the contest.` ,{
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "Start", callback_data: "join"}]
//             ]
//         }
//     })
// })

bot.action('join',ctx=>{
    ctx.answerCbQuery()
    ctx.telegram.sendMessage(ctx.chat.id , `Task 1: \n\nPlease Join our telegram gorup \nhttps://t.me/sjjshdbd \n\nClick done to proceed after you have joined` ,{
        reply_markup: {
            inline_keyboard: [
                [{text: "Done", callback_data: "groupJoin"}]
            ]
        }
    })
})

bot.action('groupJoin',ctx=>{
    checkGroup.find({userId: ctx.from.id} , (e,data)=>{
        if (e) {
            throw e
        } else {
            if (data.length > 0) {
                
                ctx.telegram.sendMessage(ctx.chat.id , `Task 2: \n\nPlease Join our telegram channel \nhttps://t.me/jsnsbdbbd \n\nClick done to proceed after you have joined` ,{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Done", callback_data: "channelJoin"}]
                        ]
                    }
                })

            } else {
               
                ctx.telegram.sendMessage(ctx.chat.id , `Task 1: \n\nPlease Join our telegram gorup \nhttps://t.me/sjjshdbd \n\nClick done to proceed after you have joined` ,{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Done", callback_data: "groupJoin"}]
                        ]
                    }
                })
            }
        }
    })
})

const input_form = new WizardScene('input_data',
    (ctx)=>{

        ctx.session.user = {}
        ctx.session.user.userId = ctx.from.id
        ctx.session.user.userName = ctx.from.first_name

        ctx.reply( `Task 3: \n\nA. Follow us on Twitter \nB. Like one of our Twitter posts, make a Twitter comment and retweet our post \n\nNote: you must retweet our post, not some other person's post \n\nWhen you are done, return here and enter your Twitter username to proceed. \n\nOur team will manually verify if you have completed this task`)
        return ctx.wizard.next()
    },
    (ctx)=>{

        ctx.session.user.twitter = ctx.update.message.text

        ctx.reply( `Task 4: \n\nA. Follow us on Reddit, comment, and share one of our posts there. \n\nNote you must comment and share our post, not some other person's post \n\nWhen you are done, return here and enter your Reddit username to proceed. \n\nOur team will manually verify if you have completed this task`)
        return ctx.wizard.next()
    },
    (ctx)=>{

        ctx.session.user.reddit = ctx.update.message.text

        ctx.reply( `Task 5: \n\nA. Like us on Facebook, comment, and share one of our posts there. \n\nNote you must comment and share our post, not some other person's post \n\nWhen you are done, return here and enter your Reddit username to proceed. \n\nOur team will manually verify if you have completed this task`)
        return ctx.wizard.next()
    },
    (ctx)=>{

        ctx.session.user.facebook = ctx.update.message.text

        ctx.reply( `Task 6: \n\nDrop your BEP-20 wallet address to receive your dogymon token if you win`)
        return ctx.wizard.next()
    },
    (ctx)=>{

        userModel.find({userId: ctx.from.id},(e,data)=>{

            if (e) {
                throw e
            } else {
                if (data.length > 0) {

                    const ref_id = parseInt(data[0].referrer_id)

                    const inputData = {
                        twitter: ctx.session.user.twitter,
                        reddit: ctx.session.user.reddit,
                        facebook: ctx.session.user.facebook,
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
                                            ctx.telegram.sendMessage(ctx.chat.id , `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${ctx.update.message.text} \nReferral Users - 0 \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id} \n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count (currently 0) increases. We will award 1bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck \n\n\nTo access your Account details At any time just click the button below or the /start command.`,{
                                                reply_markup: {
                                                    inline_keyboard: [
                                                        [{text: "Start", callback_data: "start"}]
                                                    ]
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })


                } else {
                    
                    const inputData = new userModel({
                        userId: ctx.from.id,
                        name: ctx.from.first_name,
                        twitter: ctx.session.user.twitter,
                        reddit: ctx.session.user.reddit,
                        facebook: ctx.session.user.facebook,
                        wallet:  ctx.update.message.text,
                        referral_count: '0'
                    })

                    inputData.save((e)=>{

                        if (e) {
                            throw e
                        } else {

                            ctx.telegram.sendMessage(ctx.chat.id , `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${ctx.update.message.text} \nReferral Users - 0 \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id} \n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count (currently 0) increases. We will award 1bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck \n\n\nTo access your Account details At any time just click the button below or the /start command.`,{
                                reply_markup: {
                                    inline_keyboard: [
                                        [{text: "Start", callback_data: "start"}]
                                    ]
                                }
                            })
                        }
                    })
                }
            }
        })



        return ctx.scene.leave()
    }
)


bot.action('channelJoin', async(ctx)=>{
    await ctx.scene.enter('input_data')
})





const stage = new Stage([input_form])

bot.use(stage.middleware())







bot.start((ctx)=>{

    const ref = ctx.startPayload

    userModel.find({userId : ctx.from.id } , (e,data)=>{
        if (e) {
            throw e
        } else {
            if (data.length > 0) {

                const wallet = data[0].wallet

                ctx.telegram.sendMessage(ctx.from.id,`Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${wallet} \nReferral Users - 0 \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id} \n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 1bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck`,{
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Refresh", callback_data: "start"}]
                        ]
                    }
                })
                
            } else {
                
                if (ref.length > 0) {
                    
                    const inputData = new userModel({
                        userId : ctx.from.id,
                        name: ctx.from.first_name,
                        referrer_id: ref,
                        referral_count: 0
                    })

                    inputData.save((e)=>{

                        if (e) {
                            throw e
                        } else {
                            
                            ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name}, \nWelcome to Dogymon Airdrop Contest. \n\nWe will be giving 1BNB worth of dogymon tokens each to 150 winners who have completed our simple airdrop tax and had the most number of referrals. \n\nClick the start button below to join the contest.` ,{
                                reply_markup: {
                                    inline_keyboard: [
                                        [{text: "Start", callback_data: "join"}]
                                    ]
                                }
                            })
                        }

                    })

                } else {

                    ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name}, \nWelcome to Dogymon Airdrop Contest. \n\nWe will be giving 1BNB worth of dogymon tokens each to 150 winners who have completed our simple airdrop tax and had the most number of referrals. \n\nClick the start button below to join the contest.` ,{
                        reply_markup: {
                            inline_keyboard: [
                                [{text: "Start", callback_data: "join"}]
                            ]
                        }
                    })
                }
 
            }
        }
    })

})


bot.action("start",ctx=>{

    ctx.answerCbQuery()
    ctx.deleteMessage()

    userModel.find({userId: ctx.from.id} , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            ctx.telegram.sendMessage(ctx.from.id, `Account Info: \n\nName - ${ctx.from.first_name} \nWallet Address - ${data[0].wallet} \nReferral Users - ${data[0].referral_count || '0'} \nRefferal Link - https://t.me/${ctx.botInfo.username}?start=${ctx.from.id} \n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . We will award 1bnb worth of tokens each to 150 persons with the highest number of referrals. Good luck`,{
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Refresh", callback_data: "start"}]
                    ]
                }
            })
        }
    })
})









bot.on('new_chat_members',(ctx)=>{

    console.log(ctx)

    checkGroup.find({userId: ctx.from.id} , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            if (data.length >0 ) {
                console.log("User already exists")
            } else {
                const userInput = new checkGroup({
                    userId: ctx.from.id
                })
                userInput.save((e,data)=>{
                    if (e) {
                        console.log(e)
                    }
                })
            }
        }
    })
})



// bot.launch()
module.exports = bot
