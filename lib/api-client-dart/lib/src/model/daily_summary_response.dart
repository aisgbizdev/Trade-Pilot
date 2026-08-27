//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/daily_summary_settings.dart';
import 'package:trade_pilot_api_client/src/model/daily_summary_today.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'daily_summary_response.g.dart';

/// DailySummaryResponse
///
/// Properties:
/// * [settings] 
/// * [today] 
@BuiltValue()
abstract class DailySummaryResponse implements Built<DailySummaryResponse, DailySummaryResponseBuilder> {
  @BuiltValueField(wireName: r'settings')
  DailySummarySettings get settings;

  @BuiltValueField(wireName: r'today')
  DailySummaryToday? get today;

  DailySummaryResponse._();

  factory DailySummaryResponse([void updates(DailySummaryResponseBuilder b)]) = _$DailySummaryResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DailySummaryResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DailySummaryResponse> get serializer => _$DailySummaryResponseSerializer();
}

class _$DailySummaryResponseSerializer implements PrimitiveSerializer<DailySummaryResponse> {
  @override
  final Iterable<Type> types = const [DailySummaryResponse, _$DailySummaryResponse];

  @override
  final String wireName = r'DailySummaryResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DailySummaryResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'settings';
    yield serializers.serialize(
      object.settings,
      specifiedType: const FullType(DailySummarySettings),
    );
    if (object.today != null) {
      yield r'today';
      yield serializers.serialize(
        object.today,
        specifiedType: const FullType(DailySummaryToday),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    DailySummaryResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DailySummaryResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'settings':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DailySummarySettings),
          ) as DailySummarySettings;
          result.settings.replace(valueDes);
          break;
        case r'today':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DailySummaryToday),
          ) as DailySummaryToday?;
          if (valueDes == null) continue;
          result.today.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DailySummaryResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DailySummaryResponseBuilder();
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

