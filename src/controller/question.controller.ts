import { Request, Response } from "express";
import { StartInput } from "../schema/start.schema";
import { getCcsUserByUsername } from "../service/ccsUser.service";
import getQuestion from "../service/question.service";
import errorObject from "../utils/errorObject";

export default async function questionHandler(
  req: Request<Record<string, never>, Record<string, never>, StartInput>,
  res: Response
) {
  const user = await getCcsUserByUsername(res.locals.user.username);
  const { domain } = req.body;

  try {
    if (!user.domainsAttempted.includes(domain)) {
      return res.status(403).send(errorObject(403, "domain already attempted"));
    }
    if (user.questionLoaded) {
      return res.send(errorObject(200, "", user.questionLoaded));
    }
    const easyquestions = await getQuestion(domain, "Easy");
    const mediumquestions = await getQuestion(domain, "Medium");
    const hardquestions = await getQuestion(domain, "Hard");

    const easyshuffled = easyquestions.sort(() => 0.5 - Math.random());
    let selected = easyshuffled.slice(0, 2);

    const mediumshuffled = mediumquestions.sort(() => 0.5 - Math.random());
    const mediumselected = mediumshuffled.slice(0, 2);

    const hardshuffled = hardquestions.sort(() => 0.5 - Math.random());
    const hardselected = hardshuffled.slice(0, 2);

    selected = selected.concat(hardselected);
    selected = selected.concat(mediumselected);

    user.questionLoaded = selected;
    user.save();
    // const questionIds = user.questionLoaded.map((ques) => ques.quesId);
    // logger.info(success_codes.S2, { questionIds: questionIds });
    return res.send(
      errorObject(200, "", {
        questions: selected,
      })
    );
  } catch (e) {
    // logger.error(error_codes.E0);
    return res.status(500).send(errorObject(500, e));
  }
}
