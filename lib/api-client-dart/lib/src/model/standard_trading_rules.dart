//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_instrument.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_account.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_text.dart';
import 'package:trade_pilot_api_client/src/model/date.dart';
import 'package:trade_pilot_api_client/src/model/standard_trading_rules_fixed_rate.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'standard_trading_rules.g.dart';

/// The single broker-neutral ruleset used for TP Standard Trading Rules estimates.
///
/// Properties:
/// * [name] 
/// * [version] 
/// * [effectiveDate] 
/// * [sourceDocument] 
/// * [fixedRate] 
/// * [account] 
/// * [transactionFormula] 
/// * [instruments] 
/// * [disclaimer] 
/// * [relationshipDisclosure] 
@BuiltValue()
abstract class StandardTradingRules implements Built<StandardTradingRules, StandardTradingRulesBuilder> {
  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'version')
  String get version;

  @BuiltValueField(wireName: r'effectiveDate')
  Date get effectiveDate;

  @BuiltValueField(wireName: r'sourceDocument')
  String get sourceDocument;

  @BuiltValueField(wireName: r'fixedRate')
  StandardTradingRulesFixedRate get fixedRate;

  @BuiltValueField(wireName: r'account')
  StandardTradingRuleAccount get account;

  @BuiltValueField(wireName: r'transactionFormula')
  String get transactionFormula;

  @BuiltValueField(wireName: r'instruments')
  BuiltList<StandardTradingRuleInstrument> get instruments;

  @BuiltValueField(wireName: r'disclaimer')
  StandardTradingRuleText get disclaimer;

  @BuiltValueField(wireName: r'relationshipDisclosure')
  StandardTradingRuleText get relationshipDisclosure;

  StandardTradingRules._();

  factory StandardTradingRules([void updates(StandardTradingRulesBuilder b)]) = _$StandardTradingRules;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StandardTradingRulesBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StandardTradingRules> get serializer => _$StandardTradingRulesSerializer();
}

class _$StandardTradingRulesSerializer implements PrimitiveSerializer<StandardTradingRules> {
  @override
  final Iterable<Type> types = const [StandardTradingRules, _$StandardTradingRules];

  @override
  final String wireName = r'StandardTradingRules';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StandardTradingRules object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'version';
    yield serializers.serialize(
      object.version,
      specifiedType: const FullType(String),
    );
    yield r'effectiveDate';
    yield serializers.serialize(
      object.effectiveDate,
      specifiedType: const FullType(Date),
    );
    yield r'sourceDocument';
    yield serializers.serialize(
      object.sourceDocument,
      specifiedType: const FullType(String),
    );
    yield r'fixedRate';
    yield serializers.serialize(
      object.fixedRate,
      specifiedType: const FullType(StandardTradingRulesFixedRate),
    );
    yield r'account';
    yield serializers.serialize(
      object.account,
      specifiedType: const FullType(StandardTradingRuleAccount),
    );
    yield r'transactionFormula';
    yield serializers.serialize(
      object.transactionFormula,
      specifiedType: const FullType(String),
    );
    yield r'instruments';
    yield serializers.serialize(
      object.instruments,
      specifiedType: const FullType(BuiltList, [FullType(StandardTradingRuleInstrument)]),
    );
    yield r'disclaimer';
    yield serializers.serialize(
      object.disclaimer,
      specifiedType: const FullType(StandardTradingRuleText),
    );
    yield r'relationshipDisclosure';
    yield serializers.serialize(
      object.relationshipDisclosure,
      specifiedType: const FullType(StandardTradingRuleText),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StandardTradingRules object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StandardTradingRulesBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'version':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.version = valueDes;
          break;
        case r'effectiveDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(Date),
          ) as Date;
          result.effectiveDate = valueDes;
          break;
        case r'sourceDocument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.sourceDocument = valueDes;
          break;
        case r'fixedRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRulesFixedRate),
          ) as StandardTradingRulesFixedRate;
          result.fixedRate.replace(valueDes);
          break;
        case r'account':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRuleAccount),
          ) as StandardTradingRuleAccount;
          result.account.replace(valueDes);
          break;
        case r'transactionFormula':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.transactionFormula = valueDes;
          break;
        case r'instruments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(StandardTradingRuleInstrument)]),
          ) as BuiltList<StandardTradingRuleInstrument>;
          result.instruments.replace(valueDes);
          break;
        case r'disclaimer':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRuleText),
          ) as StandardTradingRuleText;
          result.disclaimer.replace(valueDes);
          break;
        case r'relationshipDisclosure':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRuleText),
          ) as StandardTradingRuleText;
          result.relationshipDisclosure.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StandardTradingRules deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StandardTradingRulesBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

