//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/journal_stats_totals.dart';
import 'package:trade_pilot_api_client/src/model/journal_group_stat.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'journal_stats.g.dart';

/// Summary stats for the user's trade journal, computed over the optional from/to date range.
///
/// Properties:
/// * [totals] 
/// * [winRate] - wins / (wins + losses); null when no resolved trades.
/// * [avgPnlPercent] 
/// * [avgPnlAmount] 
/// * [bestInstrument] 
/// * [worstInstrument] 
/// * [bestSession] 
/// * [worstSession] 
@BuiltValue()
abstract class JournalStats implements Built<JournalStats, JournalStatsBuilder> {
  @BuiltValueField(wireName: r'totals')
  JournalStatsTotals get totals;

  /// wins / (wins + losses); null when no resolved trades.
  @BuiltValueField(wireName: r'winRate')
  num? get winRate;

  @BuiltValueField(wireName: r'avgPnlPercent')
  num? get avgPnlPercent;

  @BuiltValueField(wireName: r'avgPnlAmount')
  num? get avgPnlAmount;

  @BuiltValueField(wireName: r'bestInstrument')
  JournalGroupStat? get bestInstrument;

  @BuiltValueField(wireName: r'worstInstrument')
  JournalGroupStat? get worstInstrument;

  @BuiltValueField(wireName: r'bestSession')
  JournalGroupStat? get bestSession;

  @BuiltValueField(wireName: r'worstSession')
  JournalGroupStat? get worstSession;

  JournalStats._();

  factory JournalStats([void updates(JournalStatsBuilder b)]) = _$JournalStats;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(JournalStatsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<JournalStats> get serializer => _$JournalStatsSerializer();
}

class _$JournalStatsSerializer implements PrimitiveSerializer<JournalStats> {
  @override
  final Iterable<Type> types = const [JournalStats, _$JournalStats];

  @override
  final String wireName = r'JournalStats';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    JournalStats object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totals';
    yield serializers.serialize(
      object.totals,
      specifiedType: const FullType(JournalStatsTotals),
    );
    if (object.winRate != null) {
      yield r'winRate';
      yield serializers.serialize(
        object.winRate,
        specifiedType: const FullType(num),
      );
    }
    if (object.avgPnlPercent != null) {
      yield r'avgPnlPercent';
      yield serializers.serialize(
        object.avgPnlPercent,
        specifiedType: const FullType(num),
      );
    }
    if (object.avgPnlAmount != null) {
      yield r'avgPnlAmount';
      yield serializers.serialize(
        object.avgPnlAmount,
        specifiedType: const FullType(num),
      );
    }
    if (object.bestInstrument != null) {
      yield r'bestInstrument';
      yield serializers.serialize(
        object.bestInstrument,
        specifiedType: const FullType(JournalGroupStat),
      );
    }
    if (object.worstInstrument != null) {
      yield r'worstInstrument';
      yield serializers.serialize(
        object.worstInstrument,
        specifiedType: const FullType(JournalGroupStat),
      );
    }
    if (object.bestSession != null) {
      yield r'bestSession';
      yield serializers.serialize(
        object.bestSession,
        specifiedType: const FullType(JournalGroupStat),
      );
    }
    if (object.worstSession != null) {
      yield r'worstSession';
      yield serializers.serialize(
        object.worstSession,
        specifiedType: const FullType(JournalGroupStat),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    JournalStats object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required JournalStatsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totals':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JournalStatsTotals),
          ) as JournalStatsTotals;
          result.totals.replace(valueDes);
          break;
        case r'winRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.winRate = valueDes;
          break;
        case r'avgPnlPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.avgPnlPercent = valueDes;
          break;
        case r'avgPnlAmount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.avgPnlAmount = valueDes;
          break;
        case r'bestInstrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JournalGroupStat),
          ) as JournalGroupStat?;
          if (valueDes == null) continue;
          result.bestInstrument.replace(valueDes);
          break;
        case r'worstInstrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JournalGroupStat),
          ) as JournalGroupStat?;
          if (valueDes == null) continue;
          result.worstInstrument.replace(valueDes);
          break;
        case r'bestSession':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JournalGroupStat),
          ) as JournalGroupStat?;
          if (valueDes == null) continue;
          result.bestSession.replace(valueDes);
          break;
        case r'worstSession':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JournalGroupStat),
          ) as JournalGroupStat?;
          if (valueDes == null) continue;
          result.worstSession.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  JournalStats deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = JournalStatsBuilder();
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

