<?php

/* @ongea_theme/components/full-content.html.twig */
class __TwigTemplate_8b2a4db31ea770402022e637471b3788ca704130da09a276ff50fb49e7bf705f extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("if" => 3, "for" => 4, "include" => 24, "set" => 167);
        $filters = array("length" => 5, "t" => 37, "date" => 38, "raw" => 59, "render" => 59, "url_encode" => 168);
        $functions = array("file_url" => 105, "url" => 167, "path" => 181);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if', 'for', 'include', 'set'),
                array('length', 't', 'date', 'raw', 'render', 'url_encode'),
                array('file_url', 'url', 'path')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 2
        echo "<div class=\"page-breadcrumb\">
    ";
        // line 3
        if ($this->getAttribute(($context["data"] ?? null), "breadcrumbs", array())) {
            // line 4
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? null), "breadcrumbs", array()));
            foreach ($context['_seq'] as $context["key"] => $context["breadcrumb"]) {
                // line 5
                echo "            ";
                if ((($context["key"] + 1) < twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "breadcrumbs", array())))) {
                    echo " 
                <a class=\"-link\" href=\"";
                    // line 6
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($context["breadcrumb"], "link", array()), "html", null, true));
                    echo "\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($context["breadcrumb"], "title", array()), "html", null, true));
                    echo "</a> / 
            ";
                } else {
                    // line 8
                    echo "                <span class=\"text-bold\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($context["breadcrumb"], "title", array()), "html", null, true));
                    echo "</span>
            ";
                }
                // line 10
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['breadcrumb'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 11
            echo "    ";
        }
        // line 12
        echo "</div>

";
        // line 14
        if ($this->getAttribute(($context["data"] ?? null), "profile_page", array())) {
        } else {
            // line 15
            echo "    <div class=\"page-background\" style=\"background: #323232 url('";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "image", array()), "url", array()), "html", null, true));
            echo "') no-repeat center; background-size: cover;\"></div>
";
        }
        // line 17
        echo "
<div class=\"page-content\">
    ";
        // line 20
        echo "    <div class=\"col-md-2 left-content\">
        <div class=\"-flex\">
            <div class=\"flex-content\">
                
            ";
        // line 24
        $this->loadTemplate("@ongea_theme/components/flex-content.html.twig", "@ongea_theme/components/full-content.html.twig", 24)->display(array_merge($context, ($context["data"] ?? null)));
        // line 25
        echo "
            </div>
        </div>
    </div>

    ";
        // line 31
        echo "    <div class=\"col-md-8 center-content\">
        <div class=\"-content\">
            <div class=\"row\">
                <div class=\"col-xs-12 -dates\">
                    <div class=\"half\">
                        ";
        // line 36
        if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "from", array())) {
            // line 37
            echo "                            <p class=\"-from\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("From")));
            echo "</p>
                            <p class=\"text-bold\">";
            // line 38
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "from", array()), "d.M. Y"), "html", null, true));
            echo "</p>
                        ";
        }
        // line 40
        echo "                    </div>

                    <div class=\"half text-right\">
                        ";
        // line 43
        if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "to", array())) {
            // line 44
            echo "                            <p class=\"-from\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("To")));
            echo "</p>
                            <p class=\"text-bold\">";
            // line 45
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "date", array()), "to", array()), "d.M. Y"), "html", null, true));
            echo "</p>
                        ";
        }
        // line 47
        echo "                    </div>

                    <div class=\" text-right published\">
                        ";
        // line 50
        if ($this->getAttribute(($context["data"] ?? null), "created", array())) {
            // line 51
            echo "                            <p class=\"-created\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Published")));
            echo "</p>
                            <p class=\"text-bold\">";
            // line 52
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_date_format_filter($this->env, $this->getAttribute(($context["data"] ?? null), "created", array()), "d.M. Y"), "html", null, true));
            echo "</p>
                        ";
        }
        // line 54
        echo "                    </div>

                    <div class=\" text-right acronym\">
                        ";
        // line 57
        if ($this->getAttribute(($context["data"] ?? null), "acronym", array())) {
            // line 58
            echo "                            <p class=\"-acronym\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Acronym")));
            echo "</p>
                            <p class=\"text-bold\">";
            // line 59
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "acronym", array()))));
            echo "</p>
                        ";
        }
        // line 61
        echo "                    </div>

                </div>
                <div class=\"col-md-10 col-md-push-1 col-lg-10 col-lg-push-1 body-content\">

                    ";
        // line 67
        echo "                    ";
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "title", array())) > 0)) {
            // line 68
            echo "                        <h2 class=\"-title\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "title", array()))));
            echo "</h2>
                    ";
        }
        // line 70
        echo "
                     ";
        // line 71
        if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "permissions", array()), "name", array())) {
            echo " ";
        } else {
            // line 72
            echo "                        <h2 class=\"-name\">
                            ";
            // line 73
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "first_name", array()), "html", null, true));
            echo " ";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "last_name", array()), "html", null, true));
            echo "
                        </h2>
                    ";
        }
        // line 76
        echo "
                    ";
        // line 77
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "nickname", array())) > 0)) {
            // line 78
            echo "                        <i class=\"-nickname\">\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "nickname", array()))));
            echo "\"</i>
                    ";
        }
        // line 80
        echo "                    

                    ";
        // line 82
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "subtitle", array())) > 0)) {
            // line 83
            echo "                        <h4 class=\"-subtitle\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "subtitle", array()))));
            echo "</h4>
                    ";
        }
        // line 85
        echo "
                    ";
        // line 86
        if ($this->getAttribute(($context["data"] ?? null), "login", array())) {
            // line 87
            echo "                        <div class=\"sign-up text-center\">
                            <p>
                                <a class=\"btn sign-up-btn\" href=\"#logIn\">";
            // line 89
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Sign up now")));
            echo "</a>
                            </p>
                        </div>
                    ";
        }
        // line 93
        echo "                    
                    ";
        // line 94
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "description", array())) > 0)) {
            // line 95
            echo "                        <p class=\"-description\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "description", array()))));
            echo "</p>
                    ";
        }
        // line 97
        echo "
                    <div class=\"-body\">";
        // line 98
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute(($context["data"] ?? null), "body", array()))));
        echo "</div>

                    ";
        // line 101
        echo "                    ";
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "attachments", array())) > 0)) {
            // line 102
            echo "                        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["attachments"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["attachment"]) {
                // line 103
                echo "                            ";
                if (($this->getAttribute($context["attachment"], "display", array()) > 0)) {
                    // line 104
                    echo "                                <p class=\"-attachment\">
                                    <a href=\"";
                    // line 105
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($context["attachment"], "entity", array()), "fileuri", array()))), "html", null, true));
                    echo "\" target=\"_blank\">
                                        ";
                    // line 106
                    if ((twig_length_filter($this->env, $this->getAttribute($context["attachment"], "description", array())) > 0)) {
                        // line 107
                        echo "                                            ";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($context["attachment"], "description", array()), "html", null, true));
                        echo "
                                        ";
                    } else {
                        // line 109
                        echo "                                            ";
                        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute($context["attachment"], "entity", array()), "filename", array()), "value", array()), "html", null, true));
                        echo "
                                        ";
                    }
                    // line 111
                    echo "                                    </a>
                                </p>
                            ";
                }
                // line 114
                echo "                        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['attachment'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 115
            echo "                    ";
        }
        // line 116
        echo "

                    ";
        // line 119
        echo "                    <div class=\"-duplicate\">
                        <div class=\"not-left\">
                            ";
        // line 121
        $this->loadTemplate("@ongea_theme/components/flex-content.html.twig", "@ongea_theme/components/full-content.html.twig", 121)->display(array_merge($context, ($context["data"] ?? null)));
        // line 122
        echo "                        </div>
                    </div>

                    ";
        // line 126
        echo "                    ";
        if (($this->getAttribute($this->getAttribute(($context["data"] ?? null), "activities", array()), "count", array()) > 0)) {
            // line 127
            echo "                        <h4 class=\"description-title\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("This project contains")));
            echo " ";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "activities", array()), "count", array()), "html", null, true));
            echo " ";
            if (($this->getAttribute($this->getAttribute(($context["data"] ?? null), "activities", array()), "count", array()) > 1)) {
                echo " ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("activities")));
                echo " ";
            } else {
                echo " ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("activity")));
                echo " ";
            }
            echo "</h4>
                    ";
        }
        // line 129
        echo "
                    ";
        // line 130
        if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "activities", array()), "content", array())) > 0)) {
            // line 131
            echo "                        ";
            $this->loadTemplate("@ongea_theme/components/slider.html.twig", "@ongea_theme/components/full-content.html.twig", 131)->display(array_merge($context, array("slider_data" => $this->getAttribute($this->getAttribute(($context["data"] ?? null), "activities", array()), "content", array()), "slider_name" => t("Activity"))));
            // line 132
            echo "                    ";
        }
        // line 133
        echo "
                    ";
        // line 135
        echo "                    ";
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "profiles", array())) > 0)) {
            // line 136
            echo "                        <h4 class=\"description-title\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("People of roots")));
            echo "</h4>
                        ";
            // line 137
            $this->loadTemplate("@ongea_theme/components/slider.html.twig", "@ongea_theme/components/full-content.html.twig", 137)->display(array_merge($context, array("slider_data" => $this->getAttribute(($context["data"] ?? null), "profiles", array()), "slider_name" => false)));
            // line 138
            echo "                    ";
        }
        // line 139
        echo "
                    ";
        // line 141
        echo "                    ";
        if ((twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "organisations", array())) > 0)) {
            // line 142
            echo "                        <h4 class=\"description-title\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("This project is funded by")));
            echo "</h4>
                        ";
            // line 143
            $this->loadTemplate("@ongea_theme/components/slider.html.twig", "@ongea_theme/components/full-content.html.twig", 143)->display(array_merge($context, array("slider_data" => $this->getAttribute(($context["data"] ?? null), "organisations", array()), "slider_name" => t("Organisation"))));
            // line 144
            echo "                    ";
        }
        // line 145
        echo "
                    ";
        // line 147
        echo "                        <div id=\"logIn\">
                            ";
        // line 148
        if ($this->getAttribute(($context["data"] ?? null), "login", array())) {
            // line 149
            echo "                                <div class=\"login-form\">
                                    <h2>";
            // line 150
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Login")));
            echo "</h2>
                                    ";
            // line 151
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "login", array()), "html", null, true));
            echo "
                                </div>
                            ";
        }
        // line 154
        echo "
                            ";
        // line 155
        if ($this->getAttribute(($context["data"] ?? null), "register", array())) {
            // line 156
            echo "                                <div class=\"register-form\">
                                    <h2>";
            // line 157
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Register")));
            echo "</h2>
                                    ";
            // line 158
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "register", array()), "html", null, true));
            echo "
                                </div>
                            ";
        }
        // line 161
        echo "                        </div>

                    ";
        // line 164
        echo "                    <div class=\"-social text-center\">
                        <p>";
        // line 165
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("like it, share it")));
        echo "</p>
                        <p class=\"-icons\">
                            ";
        // line 167
        $context["url"] = $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getUrl("<current>"));
        // line 168
        echo "                            <a href=\"https://www.facebook.com/sharer/sharer.php?u=";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_urlencode_filter(($context["url"] ?? null)), "html", null, true));
        echo "\" title=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Share on Facebook")));
        echo "\"><i class=\"-icon fab fa-facebook-f\"></i></a>
                            <a href=\"https://twitter.com/home?status=";
        // line 169
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_urlencode_filter(($context["url"] ?? null)), "html", null, true));
        echo "\" title=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Share on Twitter")));
        echo "\"><i class=\"-icon fab fa-twitter\"></i></a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class=\"prev-next-links row\">
        <span class=\"text-upper -prev -links\">
            ";
        // line 180
        if ($this->getAttribute(($context["data"] ?? null), "prev", array())) {
            // line 181
            echo "                <a href=\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute($this->getAttribute(($context["data"] ?? null), "prev", array()), "nid", array()))), "html", null, true));
            echo "\">
                    <p class=\"text-bold\">";
            // line 182
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Previous")));
            echo "</p>
                    <p class=\"-title\">";
            // line 183
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "prev", array()), "title", array()), "html", null, true));
            echo "</p>
                </a>
            ";
        }
        // line 186
        echo "        </span>
        <span class=\"text-upper -next -links\">
            ";
        // line 188
        if ($this->getAttribute(($context["data"] ?? null), "next", array())) {
            // line 189
            echo "                <a href=\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute($this->getAttribute(($context["data"] ?? null), "next", array()), "nid", array()))), "html", null, true));
            echo "\">
                    <p class=\"text-bold\">";
            // line 190
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Next")));
            echo "</p>
                    <p class=\"-title\">";
            // line 191
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "next", array()), "title", array()), "html", null, true));
            echo "</p>
                </a>
            ";
        }
        // line 194
        echo "        </span>
    </div>

</div>";
    }

    public function getTemplateName()
    {
        return "@ongea_theme/components/full-content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  513 => 194,  507 => 191,  503 => 190,  498 => 189,  496 => 188,  492 => 186,  486 => 183,  482 => 182,  477 => 181,  475 => 180,  459 => 169,  452 => 168,  450 => 167,  445 => 165,  442 => 164,  438 => 161,  432 => 158,  428 => 157,  425 => 156,  423 => 155,  420 => 154,  414 => 151,  410 => 150,  407 => 149,  405 => 148,  402 => 147,  399 => 145,  396 => 144,  394 => 143,  389 => 142,  386 => 141,  383 => 139,  380 => 138,  378 => 137,  373 => 136,  370 => 135,  367 => 133,  364 => 132,  361 => 131,  359 => 130,  356 => 129,  338 => 127,  335 => 126,  330 => 122,  328 => 121,  324 => 119,  320 => 116,  317 => 115,  311 => 114,  306 => 111,  300 => 109,  294 => 107,  292 => 106,  288 => 105,  285 => 104,  282 => 103,  277 => 102,  274 => 101,  269 => 98,  266 => 97,  260 => 95,  258 => 94,  255 => 93,  248 => 89,  244 => 87,  242 => 86,  239 => 85,  233 => 83,  231 => 82,  227 => 80,  221 => 78,  219 => 77,  216 => 76,  208 => 73,  205 => 72,  201 => 71,  198 => 70,  192 => 68,  189 => 67,  182 => 61,  177 => 59,  172 => 58,  170 => 57,  165 => 54,  160 => 52,  155 => 51,  153 => 50,  148 => 47,  143 => 45,  138 => 44,  136 => 43,  131 => 40,  126 => 38,  121 => 37,  119 => 36,  112 => 31,  105 => 25,  103 => 24,  97 => 20,  93 => 17,  87 => 15,  84 => 14,  80 => 12,  77 => 11,  71 => 10,  65 => 8,  58 => 6,  53 => 5,  48 => 4,  46 => 3,  43 => 2,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/components/full-content.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/components/full-content.html.twig");
    }
}
