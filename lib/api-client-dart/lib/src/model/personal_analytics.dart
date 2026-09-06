//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/personal_analytics_top_instruments_inner.dart';
import 'package:trade_pilot_api_client/src/model/personal_analytics_weekly_data_inner.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'personal_analytics.g.dart';

/// PersonalAnalytics
///
/// Properties:
/// * [totalAllTime] 
/// * [totalThisMonth] 
/// * [totalThisWeek] 
/// * [topInstruments] 
/// * [dominantMode] 
/// * [accuracyRate] 
/// * [feedbackCount] 
/// * [weeklyData] 
@BuiltValue()
abstract class PersonalAnalytics implements Built<PersonalAnalytics, PersonalAnalyticsBuilder> {
  @BuiltValueField(wireName: r'totalAllTime')
  int get totalAllTime;

  @BuiltValueField(wireName: r'totalThisMonth')
  int get totalThisMonth;

  @BuiltValueField(wireName: r'totalThisWeek')
  int get totalThisWeek;

  @BuiltValueField(wireName: r'topInstruments')
  BuiltList<PersonalAnalyticsTopInstrumentsInner> get topInstruments;

  @BuiltValueField(wireName: r'dominantMode')
  String? get dominantMode;

  @BuiltValueField(wireName: r'accuracyRate')
  num? get accuracyRate;

  @BuiltValueField(wireName: r'feedbackCount')
  int get feedbackCount;

  @BuiltValueField(wireName: r'weeklyData')
  BuiltList<PersonalAnalyticsWeeklyDataInner> get weeklyData;

  PersonalAnalytics._();

  factory PersonalAnalytics([void updates(PersonalAnalyticsBuilder b)]) = _$PersonalAnalytics;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PersonalAnalyticsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PersonalAnalytics> get serializer => _$PersonalAnalyticsSerializer();
}

class _$PersonalAnalyticsSerializer implements PrimitiveSerializer<PersonalAnalytics> {
  @override
  final Iterable<Type> types = const [PersonalAnalytics, _$PersonalAnalytics];

  @override
  final String wireName = r'PersonalAnalytics';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PersonalAnalytics object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalAllTime';
    yield serializers.serialize(
      object.totalAllTime,
      specifiedType: const FullType(int),
    );
    yield r'totalThisMonth';
    yield serializers.serialize(
      object.totalThisMonth,
      specifiedType: const FullType(int),
    );
    yield r'totalThisWeek';
    yield serializers.serialize(
      object.totalThisWeek,
      specifiedType: const FullType(int),
    );
    yield r'topInstruments';
    yield serializers.serialize(
      object.topInstruments,
      specifiedType: const FullType(BuiltList, [FullType(PersonalAnalyticsTopInstrumentsInner)]),
    );
    if (object.dominantMode != null) {
      yield r'dominantMode';
      yield serializers.serialize(
        object.dominantMode,
        specifiedType: const FullType(String),
      );
    }
    if (object.accuracyRate != null) {
      yield r'accuracyRate';
      yield serializers.serialize(
        object.accuracyRate,
        specifiedType: const FullType(num),
      );
    }
    yield r'feedbackCount';
    yield serializers.serialize(
      object.feedbackCount,
      specifiedType: const FullType(int),
    );
    yield r'weeklyData';
    yield serializers.serialize(
      object.weeklyData,
      specifiedType: const FullType(BuiltList, [FullType(PersonalAnalyticsWeeklyDataInner)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PersonalAnalytics object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PersonalAnalyticsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalAllTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalAllTime = valueDes;
          break;
        case r'totalThisMonth':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalThisMonth = valueDes;
          break;
        case r'totalThisWeek':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalThisWeek = valueDes;
          break;
        case r'topInstruments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(PersonalAnalyticsTopInstrumentsInner)]),
          ) as BuiltList<PersonalAnalyticsTopInstrumentsInner>;
          result.topInstruments.replace(valueDes);
          break;
        case r'dominantMode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.dominantMode = valueDes;
          break;
        case r'accuracyRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.accuracyRate = valueDes;
          break;
        case r'feedbackCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.feedbackCount = valueDes;
          break;
        case r'weeklyData':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(PersonalAnalyticsWeeklyDataInner)]),
          ) as BuiltList<PersonalAnalyticsWeeklyDataInner>;
          result.weeklyData.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PersonalAnalytics deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PersonalAnalyticsBuilder();
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

