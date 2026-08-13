//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'push_prefs.g.dart';

/// PushPrefs
///
/// Properties:
/// * [pushExpiry] 
/// * [pushBroadcast] 
/// * [pushDailySummary] 
/// * [pushMarketNews] 
/// * [pushCalendarEvents] 
/// * [pushPriceAnomaly] 
/// * [pushWeeklyRecap] 
/// * [pushSignalFlip] 
/// * [marketOpenSessions] - FX sessions the user wants a 5-min pre-open ping for. Empty = off.
/// * [pushDormancyNudge] - Opt-in toggle for the weekly \"we miss you\" nudge after 7+ days idle.
/// * [pushOnboarding] - One-shot 24h-after-signup empty-watchlist nudge.
/// * [disengageNoticeCategory] - When non-null, the UI should render a one-time banner explaining auto-pause.
/// * [guardrailRevenge] - Show soft warning when a loss on this instrument fired within the revenge window.
/// * [guardrailOvertrading] - Show soft warning when the user crosses the per-hour or per-day analysis count.
/// * [guardrailHighRisk] - Show soft warning when a high-impact event for the instrument prints within 30 min.
/// * [coolingOffEnabled] - Opt-in 30-minute countdown after a significant loss before showing the analyse button warning.
@BuiltValue()
abstract class PushPrefs implements Built<PushPrefs, PushPrefsBuilder> {
  @BuiltValueField(wireName: r'pushExpiry')
  bool get pushExpiry;

  @BuiltValueField(wireName: r'pushBroadcast')
  bool get pushBroadcast;

  @BuiltValueField(wireName: r'pushDailySummary')
  bool get pushDailySummary;

  @BuiltValueField(wireName: r'pushMarketNews')
  bool get pushMarketNews;

  @BuiltValueField(wireName: r'pushCalendarEvents')
  bool get pushCalendarEvents;

  @BuiltValueField(wireName: r'pushPriceAnomaly')
  bool get pushPriceAnomaly;

  @BuiltValueField(wireName: r'pushWeeklyRecap')
  bool get pushWeeklyRecap;

  @BuiltValueField(wireName: r'pushSignalFlip')
  bool get pushSignalFlip;

  /// FX sessions the user wants a 5-min pre-open ping for. Empty = off.
  @BuiltValueField(wireName: r'marketOpenSessions')
  BuiltList<PushPrefsMarketOpenSessionsEnum> get marketOpenSessions;
  // enum marketOpenSessionsEnum {  tokyo,  london,  newyork,  };

  /// Opt-in toggle for the weekly \"we miss you\" nudge after 7+ days idle.
  @BuiltValueField(wireName: r'pushDormancyNudge')
  bool get pushDormancyNudge;

  /// One-shot 24h-after-signup empty-watchlist nudge.
  @BuiltValueField(wireName: r'pushOnboarding')
  bool get pushOnboarding;

  /// When non-null, the UI should render a one-time banner explaining auto-pause.
  @BuiltValueField(wireName: r'disengageNoticeCategory')
  String? get disengageNoticeCategory;

  /// Show soft warning when a loss on this instrument fired within the revenge window.
  @BuiltValueField(wireName: r'guardrailRevenge')
  bool get guardrailRevenge;

  /// Show soft warning when the user crosses the per-hour or per-day analysis count.
  @BuiltValueField(wireName: r'guardrailOvertrading')
  bool get guardrailOvertrading;

  /// Show soft warning when a high-impact event for the instrument prints within 30 min.
  @BuiltValueField(wireName: r'guardrailHighRisk')
  bool get guardrailHighRisk;

  /// Opt-in 30-minute countdown after a significant loss before showing the analyse button warning.
  @BuiltValueField(wireName: r'coolingOffEnabled')
  bool get coolingOffEnabled;

  PushPrefs._();

  factory PushPrefs([void updates(PushPrefsBuilder b)]) = _$PushPrefs;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PushPrefsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PushPrefs> get serializer => _$PushPrefsSerializer();
}

class _$PushPrefsSerializer implements PrimitiveSerializer<PushPrefs> {
  @override
  final Iterable<Type> types = const [PushPrefs, _$PushPrefs];

  @override
  final String wireName = r'PushPrefs';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PushPrefs object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'pushExpiry';
    yield serializers.serialize(
      object.pushExpiry,
      specifiedType: const FullType(bool),
    );
    yield r'pushBroadcast';
    yield serializers.serialize(
      object.pushBroadcast,
      specifiedType: const FullType(bool),
    );
    yield r'pushDailySummary';
    yield serializers.serialize(
      object.pushDailySummary,
      specifiedType: const FullType(bool),
    );
    yield r'pushMarketNews';
    yield serializers.serialize(
      object.pushMarketNews,
      specifiedType: const FullType(bool),
    );
    yield r'pushCalendarEvents';
    yield serializers.serialize(
      object.pushCalendarEvents,
      specifiedType: const FullType(bool),
    );
    yield r'pushPriceAnomaly';
    yield serializers.serialize(
      object.pushPriceAnomaly,
      specifiedType: const FullType(bool),
    );
    yield r'pushWeeklyRecap';
    yield serializers.serialize(
      object.pushWeeklyRecap,
      specifiedType: const FullType(bool),
    );
    yield r'pushSignalFlip';
    yield serializers.serialize(
      object.pushSignalFlip,
      specifiedType: const FullType(bool),
    );
    yield r'marketOpenSessions';
    yield serializers.serialize(
      object.marketOpenSessions,
      specifiedType: const FullType(BuiltList, [FullType(PushPrefsMarketOpenSessionsEnum)]),
    );
    yield r'pushDormancyNudge';
    yield serializers.serialize(
      object.pushDormancyNudge,
      specifiedType: const FullType(bool),
    );
    yield r'pushOnboarding';
    yield serializers.serialize(
      object.pushOnboarding,
      specifiedType: const FullType(bool),
    );
    if (object.disengageNoticeCategory != null) {
      yield r'disengageNoticeCategory';
      yield serializers.serialize(
        object.disengageNoticeCategory,
        specifiedType: const FullType(String),
      );
    }
    yield r'guardrailRevenge';
    yield serializers.serialize(
      object.guardrailRevenge,
      specifiedType: const FullType(bool),
    );
    yield r'guardrailOvertrading';
    yield serializers.serialize(
      object.guardrailOvertrading,
      specifiedType: const FullType(bool),
    );
    yield r'guardrailHighRisk';
    yield serializers.serialize(
      object.guardrailHighRisk,
      specifiedType: const FullType(bool),
    );
    yield r'coolingOffEnabled';
    yield serializers.serialize(
      object.coolingOffEnabled,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PushPrefs object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PushPrefsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'pushExpiry':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushExpiry = valueDes;
          break;
        case r'pushBroadcast':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushBroadcast = valueDes;
          break;
        case r'pushDailySummary':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushDailySummary = valueDes;
          break;
        case r'pushMarketNews':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushMarketNews = valueDes;
          break;
        case r'pushCalendarEvents':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushCalendarEvents = valueDes;
          break;
        case r'pushPriceAnomaly':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushPriceAnomaly = valueDes;
          break;
        case r'pushWeeklyRecap':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushWeeklyRecap = valueDes;
          break;
        case r'pushSignalFlip':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushSignalFlip = valueDes;
          break;
        case r'marketOpenSessions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(PushPrefsMarketOpenSessionsEnum)]),
          ) as BuiltList<PushPrefsMarketOpenSessionsEnum>;
          result.marketOpenSessions.replace(valueDes);
          break;
        case r'pushDormancyNudge':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushDormancyNudge = valueDes;
          break;
        case r'pushOnboarding':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushOnboarding = valueDes;
          break;
        case r'disengageNoticeCategory':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.disengageNoticeCategory = valueDes;
          break;
        case r'guardrailRevenge':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.guardrailRevenge = valueDes;
          break;
        case r'guardrailOvertrading':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.guardrailOvertrading = valueDes;
          break;
        case r'guardrailHighRisk':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.guardrailHighRisk = valueDes;
          break;
        case r'coolingOffEnabled':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.coolingOffEnabled = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PushPrefs deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PushPrefsBuilder();
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

class PushPrefsMarketOpenSessionsEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'tokyo')
  static const PushPrefsMarketOpenSessionsEnum tokyo = _$pushPrefsMarketOpenSessionsEnum_tokyo;
  @BuiltValueEnumConst(wireName: r'london')
  static const PushPrefsMarketOpenSessionsEnum london = _$pushPrefsMarketOpenSessionsEnum_london;
  @BuiltValueEnumConst(wireName: r'newyork')
  static const PushPrefsMarketOpenSessionsEnum newyork = _$pushPrefsMarketOpenSessionsEnum_newyork;

  static Serializer<PushPrefsMarketOpenSessionsEnum> get serializer => _$pushPrefsMarketOpenSessionsEnumSerializer;

  const PushPrefsMarketOpenSessionsEnum._(String name): super(name);

  static BuiltSet<PushPrefsMarketOpenSessionsEnum> get values => _$pushPrefsMarketOpenSessionsEnumValues;
  static PushPrefsMarketOpenSessionsEnum valueOf(String name) => _$pushPrefsMarketOpenSessionsEnumValueOf(name);
}

